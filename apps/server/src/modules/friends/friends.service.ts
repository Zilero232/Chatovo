import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { isNullish } from 'remeda';

import { prisma } from '../../core';
import { getUserWithProfileOrThrow, roomSelect } from '../../lib';
import { userWithProfileInclude } from '../../lib/selectors';
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

const findFriendship = (userId: string, otherUserId: string) => {
  return prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: userId, addresseeId: otherUserId },
        { requesterId: otherUserId, addresseeId: userId },
      ],
    },
    include: friendshipInclude,
  });
};

const toRelation = (
  row: NonNullable<Awaited<ReturnType<typeof findFriendship>>>,
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

export const listFriends = async (userId: string): Promise<FriendEntry[]> => {
  const rows = await prisma.friendship.findMany({
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
};

export const listIncomingRequests = async (userId: string): Promise<FriendRequestEntry[]> => {
  const rows = await prisma.friendship.findMany({
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
};

export const getFriendshipRelation = async (
  userId: string,
  otherUserId: string,
): Promise<FriendshipRelation> => {
  if (userId === otherUserId) {
    return { status: 'none' };
  }

  const row = await findFriendship(userId, otherUserId);

  if (isNullish(row)) {
    return { status: 'none' };
  }

  return toRelation(row, userId);
};

const createFriendshipRequest = async (
  requesterId: string,
  addresseeId: string,
): Promise<FriendshipRelation> => {
  if (requesterId === addresseeId) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'Cannot friend yourself' });
  }

  await getUserWithProfileOrThrow(addresseeId);

  const existing = await findFriendship(requesterId, addresseeId);

  if (!isNullish(existing)) {
    if (existing.status === 'accepted') {
      throw new HTTPException(StatusCodes.CONFLICT, { message: 'Already friends' });
    }

    if (existing.requesterId === addresseeId) {
      throw new HTTPException(StatusCodes.CONFLICT, {
        message: 'This user already sent you a request',
      });
    }

    return toRelation(existing, requesterId);
  }

  const row = await prisma.friendship.create({
    data: { requesterId, addresseeId },
    include: friendshipInclude,
  });

  bumpFriendsEpoch(requesterId, addresseeId);

  return toRelation(row, requesterId);
};

export const findUserByTag = async (tag: string): Promise<FriendUser> => {
  const friendTag = normalizeFriendTag(tag);
  const user = await prisma.user.findUnique({
    where: { friendTag },
    include: userWithProfileInclude,
  });

  if (isNullish(user)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'User not found' });
  }

  return toFriendUser(user);
};

export const sendFriendRequest = async (
  requesterId: string,
  tag: string,
): Promise<FriendshipRelation> => {
  const target = await prisma.user.findUnique({
    where: { friendTag: normalizeFriendTag(tag) },
    select: { id: true },
  });

  if (isNullish(target)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'User not found' });
  }

  return createFriendshipRequest(requesterId, target.id);
};

export const acceptFriendRequest = async (
  userId: string,
  friendshipId: string,
): Promise<FriendshipRelation> => {
  const row = await prisma.friendship.findUnique({
    where: { id: friendshipId },
    include: friendshipInclude,
  });

  if (isNullish(row) || row.addresseeId !== userId || row.status !== 'pending') {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Request not found' });
  }

  const updated = await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: 'accepted' },
    include: friendshipInclude,
  });

  bumpFriendsEpoch(userId, updated.requesterId);

  return toRelation(updated, userId);
};

export const declineFriendRequest = async (userId: string, friendshipId: string): Promise<void> => {
  const row = await prisma.friendship.findUnique({ where: { id: friendshipId } });

  if (isNullish(row) || row.addresseeId !== userId || row.status !== 'pending') {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Request not found' });
  }

  bumpFriendsEpoch(userId, row.requesterId);

  await prisma.friendship.delete({ where: { id: friendshipId } });
};

export const removeFriendship = async (userId: string, otherUserId: string): Promise<void> => {
  const row = await findFriendship(userId, otherUserId);

  if (isNullish(row)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Friendship not found' });
  }

  if (row.status === 'pending' && row.requesterId !== userId) {
    throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Cannot cancel this request' });
  }

  await prisma.friendship.delete({ where: { id: row.id } });

  bumpFriendsEpoch(userId, otherUserId);
};

export const getOrCreateDmRoom = async (userId: string, otherUserId: string): Promise<Room> => {
  if (userId === otherUserId) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'Cannot create DM with yourself' });
  }

  const relation = await findFriendship(userId, otherUserId);

  if (isNullish(relation) || relation.status !== 'accepted') {
    throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Only friends can open DM' });
  }

  const [dmUserAId, dmUserBId] =
    userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

  const room = await prisma.room.upsert({
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
};

export const ringFriendCall = async (userId: string, otherUserId: string): Promise<Room> => {
  const room = await getOrCreateDmRoom(userId, otherUserId);
  const caller = await getUserWithProfileOrThrow(userId);
  const callee = await getUserWithProfileOrThrow(otherUserId);

  setPendingCall({
    roomId: room.id,
    caller: toFriendUser(caller),
    callee: toFriendUser(callee),
    calleeId: otherUserId,
  });

  return room;
};

export const getIncomingFriendCall = async (
  userId: string,
): Promise<IncomingFriendCallResponse> => {
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
};

export const acceptIncomingFriendCall = async (
  userId: string,
): Promise<IncomingFriendCall | null> => {
  const pending = markCallAccepted(userId);

  if (isNullish(pending)) {
    return null;
  }

  return {
    roomId: pending.roomId,
    caller: pending.caller,
  };
};

export const declineIncomingFriendCall = async (userId: string): Promise<void> => {
  markCallDeclined(userId);
};

export const getOutgoingFriendCall = async (
  userId: string,
): Promise<OutgoingFriendCallResponse> => {
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
};

export const ackOutgoingFriendCall = async (userId: string): Promise<void> => {
  clearPendingCallForCaller(userId);
};

export const cancelOutgoingFriendCall = async (userId: string): Promise<void> => {
  clearPendingCallForCaller(userId);
};
