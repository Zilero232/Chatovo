import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { isNullish } from 'remeda';

import { RoomKind } from '../../generated';
import { basePrisma as prisma } from '../core';
import { resolveDisplayName } from '../modules/users/profile';
import { userWithProfileInclude } from './selectors';

import type { UserWithProfile } from '../modules/users/profile';

export const assertRoomExists = async (roomId: string): Promise<void> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { id: true } });

  if (isNullish(room)) {
    throw new NotFoundException('Room not found');
  }
};

export const assertCanAccessDmRoom = async (roomId: string, userId: string): Promise<void> => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { kind: true, dmUserAId: true, dmUserBId: true },
  });

  if (isNullish(room)) {
    throw new NotFoundException('Room not found');
  }

  if (room.kind !== RoomKind.dm) {
    return;
  }

  if (room.dmUserAId !== userId && room.dmUserBId !== userId) {
    throw new ForbiddenException('Forbidden');
  }
};

export const assertCanManageRoom = async (roomId: string, userId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { ownerId: true, isPrivate: true, password: true, name: true },
  });

  if (isNullish(room)) {
    throw new NotFoundException('Room not found');
  }
  if (room.ownerId !== userId) {
    throw new ForbiddenException('Forbidden');
  }

  return room;
};

export const getUserWithProfileOrThrow = async (userId: string): Promise<UserWithProfile> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: userWithProfileInclude,
  });

  if (isNullish(user)) {
    throw new NotFoundException('User not found');
  }

  return user;
};

export const getRoomName = async (roomId: string): Promise<string> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { name: true } });

  return room?.name ?? roomId;
};

export const getRoomDmRouting = async (roomId: string) => {
  return prisma.room.findUnique({
    where: { id: roomId },
    select: { kind: true, dmUserAId: true, dmUserBId: true },
  });
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
