import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { isNullish } from 'remeda';
import { prisma } from '../core';
import { userWithProfileInclude } from './selectors';
import type { UserWithProfile } from '../modules/users/profile';

export const assertRoomExists = async (roomId: string): Promise<void> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { id: true } });

  if (isNullish(room)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Room not found' });
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
