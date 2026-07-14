import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isNullish } from 'remeda';

import { PrismaService } from '../../core';
import { getUserWithProfileOrThrow, roomSelect } from '../../lib';
import { userWithProfileInclude } from '../../lib/selectors';
import { hasUserConnection } from '../realtime/connection-store';
import { emitUserEvent } from '../realtime/emit';
import { toUserProfile, type UserWithProfile } from '../users/profile';
import {
  bumpFriendsEpoch,
  clearPendingCallForCaller,
  getPendingCallForCallee,
  getPendingCallForCaller,
  markCallAccepted,
  markCallDeclined,
  setPendingCall,
} from './call-store';

import type {
  FriendEntry,
  FriendRequestEntry,
  FriendshipRelation,
  FriendUser,
  IncomingFriendCall,
  IncomingFriendCallResponse,
  OutgoingFriendCallResponse,
  Room,
} from '@chatovo/schemas';

const friendshipInclude = {
  requester: { include: userWithProfileInclude },
  addressee: { include: userWithProfileInclude },
} as const;

const toFriendUser = (user: UserWithProfile): FriendUser => {
  const profile = toUserProfile(user);

  return {
    id: profile.id,
    name: profile.name,
    friendTag: profile.friendTag,
    avatarUrl: profile.avatarUrl,
    verified: profile.verified,
    isOnline: hasUserConnection(profile.id),
  };
};

const normalizeFriendTag = (tag: string): string => {
  return tag.trim().toLowerCase();
};

const otherUser = (
  row: {
    requesterId: string;
    requester: UserWithProfile;
    addressee: UserWithProfile;
  },
  userId: string,
): UserWithProfile => {
  return row.requesterId === userId ? row.addressee : row.requester;
};

const toRelation = (
  row: { id: string; status: string; requesterId: string },
  userId: string,
): FriendshipRelation => {
  if (row.status === 'accepted') {
    return { status: 'friends', friendshipId: row.id };
  }

  if (row.requesterId === userId) {
    return { status: 'outgoing_pending', friendshipId: row.id };
  }

  return { status: 'incoming_pending', friendshipId: row.id };
};

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  private findFriendship(userId: string, otherUserId: string) {
    return this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: otherUserId },
          { requesterId: otherUserId, addresseeId: userId },
        ],
      },
      include: friendshipInclude,
    });
  }

  async listFriends(userId: string): Promise<FriendEntry[]> {
    const rows = await this.prisma.friendship.findMany({
      where: {
        status: 'accepted',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: friendshipInclude,
      orderBy: { updatedAt: 'desc' },
    });

    return rows.map((row) => {
      return {
        friendshipId: row.id,
        user: toFriendUser(otherUser(row, userId)),
        since: row.updatedAt.toISOString(),
      };
    });
  }

  async broadcastFriendPresence(userId: string, isOnline: boolean): Promise<void> {
    const rows = await this.prisma.friendship.findMany({
      where: {
        status: 'accepted',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: { requesterId: true, addresseeId: true },
    });

    for (const row of rows) {
      const friendId = row.requesterId === userId ? row.addresseeId : row.requesterId;

      emitUserEvent(friendId, { type: 'friend.presence', userId, isOnline });
    }
  }

  async listIncomingRequests(userId: string): Promise<FriendRequestEntry[]> {
    const rows = await this.prisma.friendship.findMany({
      where: { addresseeId: userId, status: 'pending' },
      include: friendshipInclude,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => {
      return {
        friendshipId: row.id,
        user: toFriendUser(row.requester),
        requestedAt: row.createdAt.toISOString(),
      };
    });
  }

  async getFriendshipRelation(userId: string, otherUserId: string): Promise<FriendshipRelation> {
    if (userId === otherUserId) {
      return { status: 'none' };
    }

    const row = await this.findFriendship(userId, otherUserId);

    if (isNullish(row)) {
      return { status: 'none' };
    }

    return toRelation(row, userId);
  }

  private async createFriendshipRequest(
    requesterId: string,
    addresseeId: string,
  ): Promise<FriendshipRelation> {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot friend yourself');
    }

    await getUserWithProfileOrThrow(addresseeId);

    const existing = await this.findFriendship(requesterId, addresseeId);

    if (!isNullish(existing)) {
      if (existing.status === 'accepted') {
        throw new ConflictException('Already friends');
      }

      if (existing.requesterId === addresseeId) {
        throw new ConflictException('This user already sent you a request');
      }

      return toRelation(existing, requesterId);
    }

    const row = await this.prisma.friendship.create({
      data: { requesterId, addresseeId },
      include: friendshipInclude,
    });

    bumpFriendsEpoch(requesterId, addresseeId);

    return toRelation(row, requesterId);
  }

  async findUserByTag(tag: string): Promise<FriendUser> {
    const friendTag = normalizeFriendTag(tag);
    const user = await this.prisma.user.findUnique({
      where: { friendTag },
      include: userWithProfileInclude,
    });

    if (isNullish(user)) {
      throw new NotFoundException('User not found');
    }

    return toFriendUser(user);
  }

  async sendFriendRequest(requesterId: string, tag: string): Promise<FriendshipRelation> {
    const target = await this.prisma.user.findUnique({
      where: { friendTag: normalizeFriendTag(tag) },
      select: { id: true },
    });

    if (isNullish(target)) {
      throw new NotFoundException('User not found');
    }

    return this.createFriendshipRequest(requesterId, target.id);
  }

  async acceptFriendRequest(userId: string, friendshipId: string): Promise<FriendshipRelation> {
    const row = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
      include: friendshipInclude,
    });

    if (isNullish(row) || row.addresseeId !== userId || row.status !== 'pending') {
      throw new NotFoundException('Request not found');
    }

    const updated = await this.prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'accepted' },
      include: friendshipInclude,
    });

    bumpFriendsEpoch(userId, updated.requesterId);

    return toRelation(updated, userId);
  }

  async declineFriendRequest(userId: string, friendshipId: string): Promise<void> {
    const row = await this.prisma.friendship.findUnique({ where: { id: friendshipId } });

    if (isNullish(row) || row.addresseeId !== userId || row.status !== 'pending') {
      throw new NotFoundException('Request not found');
    }

    bumpFriendsEpoch(userId, row.requesterId);

    await this.prisma.friendship.delete({ where: { id: friendshipId } });
  }

  async removeFriendship(userId: string, otherUserId: string): Promise<void> {
    const row = await this.findFriendship(userId, otherUserId);

    if (isNullish(row)) {
      throw new NotFoundException('Friendship not found');
    }

    if (row.status === 'pending' && row.requesterId !== userId) {
      throw new ForbiddenException('Cannot cancel this request');
    }

    await this.prisma.friendship.delete({ where: { id: row.id } });

    bumpFriendsEpoch(userId, otherUserId);
  }

  async getOrCreateDmRoom(userId: string, otherUserId: string): Promise<Room> {
    if (userId === otherUserId) {
      throw new BadRequestException('Cannot create DM with yourself');
    }

    const relation = await this.findFriendship(userId, otherUserId);

    if (isNullish(relation) || relation.status !== 'accepted') {
      throw new ForbiddenException('Only friends can open DM');
    }

    const [dmUserAId, dmUserBId] =
      userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

    const room = await this.prisma.room.upsert({
      where: {
        kind_dmUserAId_dmUserBId: {
          kind: 'dm',
          dmUserAId,
          dmUserBId,
        },
      },
      create: {
        ownerId: userId,
        name: `dm-${crypto.randomUUID()}`,
        isPrivate: false,
        kind: 'dm',
        dmUserAId,
        dmUserBId,
      },
      update: { isPrivate: false, password: null },
      select: roomSelect,
    });

    return room;
  }

  async ringFriendCall(userId: string, otherUserId: string): Promise<Room> {
    const room = await this.getOrCreateDmRoom(userId, otherUserId);
    const caller = await getUserWithProfileOrThrow(userId);
    const callee = await getUserWithProfileOrThrow(otherUserId);

    setPendingCall({
      roomId: room.id,
      caller: toFriendUser(caller),
      callee: toFriendUser(callee),
      calleeId: otherUserId,
    });

    return room;
  }

  async getIncomingFriendCall(userId: string): Promise<IncomingFriendCallResponse> {
    const pending = getPendingCallForCallee(userId);

    if (isNullish(pending)) {
      return { call: null };
    }

    return {
      call: {
        roomId: pending.roomId,
        caller: pending.caller,
      },
    };
  }

  async acceptIncomingFriendCall(userId: string): Promise<IncomingFriendCall | null> {
    const pending = markCallAccepted(userId);

    if (isNullish(pending)) {
      return null;
    }

    return {
      roomId: pending.roomId,
      caller: pending.caller,
    };
  }

  async declineIncomingFriendCall(userId: string): Promise<void> {
    markCallDeclined(userId);
  }

  async getOutgoingFriendCall(userId: string): Promise<OutgoingFriendCallResponse> {
    const pending = getPendingCallForCaller(userId);

    if (isNullish(pending)) {
      return { call: null };
    }

    return {
      call: {
        roomId: pending.roomId,
        callee: pending.callee,
        status: pending.status,
      },
    };
  }

  async ackOutgoingFriendCall(userId: string): Promise<void> {
    clearPendingCallForCaller(userId);
  }

  async cancelOutgoingFriendCall(userId: string): Promise<void> {
    clearPendingCallForCaller(userId);
  }
}
