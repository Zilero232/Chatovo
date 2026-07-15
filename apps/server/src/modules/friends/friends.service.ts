import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isNullish } from 'remeda';

import { FriendshipStatus, Prisma, RoomKind } from '../../../generated';
import { PrismaService } from '../../core';
import { getUserWithProfileOrThrow, roomSelect } from '../../lib';
import { userWithProfileInclude } from '../../lib/selectors';
import { emitUserEvent } from '../realtime/emit';
import {
  bumpFriendsEpoch,
  clearPendingCallForCaller,
  getPendingCallForCallee,
  getPendingCallForCaller,
  markCallAccepted,
  markCallDeclined,
  setPendingCall,
} from './call-store';
import {
  friendshipInclude,
  normalizeFriendTag,
  otherUser,
  toFriendUser,
  toRelation,
} from './mappers';

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
        status: FriendshipStatus.accepted,
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
        status: FriendshipStatus.accepted,
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
      where: { addresseeId: userId, status: FriendshipStatus.pending },
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
      if (existing.status === FriendshipStatus.accepted) {
        throw new ConflictException('Already friends');
      }

      if (existing.requesterId === addresseeId) {
        throw new ConflictException('This user already sent you a request');
      }

      return toRelation(existing, requesterId);
    }

    try {
      const row = await this.prisma.friendship.create({
        data: { requesterId, addresseeId },
        include: friendshipInclude,
      });

      bumpFriendsEpoch(requesterId, addresseeId);

      return toRelation(row, requesterId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Friend request already exists');
      }

      throw error;
    }
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

    if (isNullish(row) || row.addresseeId !== userId || row.status !== FriendshipStatus.pending) {
      throw new NotFoundException('Request not found');
    }

    const updated = await this.prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: FriendshipStatus.accepted },
      include: friendshipInclude,
    });

    bumpFriendsEpoch(userId, updated.requesterId);

    return toRelation(updated, userId);
  }

  async declineFriendRequest(userId: string, friendshipId: string): Promise<void> {
    const row = await this.prisma.friendship.findUnique({ where: { id: friendshipId } });

    if (isNullish(row) || row.addresseeId !== userId || row.status !== FriendshipStatus.pending) {
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

    if (row.status === FriendshipStatus.pending && row.requesterId !== userId) {
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

    if (isNullish(relation) || relation.status !== FriendshipStatus.accepted) {
      throw new ForbiddenException('Only friends can open DM');
    }

    const [dmUserAId, dmUserBId] =
      userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

    const room = await this.prisma.room.upsert({
      where: {
        kind_dmUserAId_dmUserBId: {
          kind: RoomKind.dm,
          dmUserAId,
          dmUserBId,
        },
      },
      create: {
        ownerId: userId,
        name: `dm-${crypto.randomUUID()}`,
        isPrivate: false,
        kind: RoomKind.dm,
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
    const [caller, callee] = await Promise.all([
      getUserWithProfileOrThrow(userId),
      getUserWithProfileOrThrow(otherUserId),
    ]);

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
