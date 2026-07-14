import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { isNullish } from 'remeda';

import { prisma } from '../core';
import { resolveDisplayName } from '../modules/users/profile';
import { userWithProfileInclude } from './selectors';

import type { UserWithProfile } from '../modules/users/profile';

export const assertRoomExists = async (roomId: string): Promise<void> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { id: true } });

  if (isNullish(room)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Room not found' });
  }
};

export const assertCanAccessDmRoom = async (roomId: string, userId: string): Promise<void> => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { kind: true, dmUserAId: true, dmUserBId: true },
  });

  if (isNullish(room)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Room not found' });
  }

  if (room.kind !== 'dm') {
    return;
  }

  if (room.dmUserAId !== userId && room.dmUserBId !== userId) {
    throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Forbidden' });
  }
};

// Only the owner may rename, change password, or flip privacy. Returns the
// current owner-relevant fields so callers can reason about password coupling.
export const assertCanManageRoom = async (roomId: string, userId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { ownerId: true, isPrivate: true, password: true },
  });

  if (isNullish(room)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Room not found' });
  }
  if (room.ownerId !== userId) {
    throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Forbidden' });
  }

  return room;
};

export const getUserWithProfileOrThrow = async (userId: string): Promise<UserWithProfile> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: userWithProfileInclude,
  });

  if (isNullish(user)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'User not found' });
  }

  return user;
};

export const getRoomName = async (roomId: string): Promise<string> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { name: true } });

  return room?.name ?? roomId;
};

export const getUserDisplayName = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, profile: { select: { displayName: true } } },
  });

  return resolveDisplayName({
    displayName: user?.profile?.displayName,
    name: user?.name,
    email: user?.email,
    userId,
  });
};
