import { isNonNullish } from 'remeda';
import { prisma } from '../../core';
import { assertCanManageRoom, roomSelect } from '../../lib';
import type { CreateRoomRequest, UpdateRoomRequest } from '@chatovo/schemas';
import type { Prisma } from '../../../generated';

export const listRooms = () => {
  return prisma.room.findMany({ orderBy: { createdAt: 'desc' }, select: roomSelect });
};

export const getRoom = (id: string) => {
  return prisma.room.findUnique({ where: { id }, select: roomSelect });
};

export const createRoom = (input: CreateRoomRequest, ownerId: string) => {
  const { isPrivate, name, password } = input;

  // Public rooms never carry a password — drop whatever the client sent.
  const storedPassword = isPrivate ? (password ?? null) : null;

  return prisma.room.create({
    data: { name, isPrivate, password: storedPassword, ownerId },
    select: roomSelect,
  });
};

export const updateRoom = async (id: string, input: UpdateRoomRequest, userId: string) => {
  const current = await assertCanManageRoom(id, userId);

  // Privacy and password are coupled:
  //   - turning private OFF clears the stored password so joins skip the check
  //   - a new password replaces the stored one when room stays/becomes private
  //   - keeping isPrivate true without a new password leaves the existing one
  const data: Prisma.RoomUpdateInput = {};

  if (isNonNullish(input.name)) {
    data.name = input.name;
  }

  if (isNonNullish(input.isPrivate)) {
    data.isPrivate = input.isPrivate;

    if (input.isPrivate === false) {
      data.password = null;
    }
  }

  if (isNonNullish(input.password)) {
    const willBePrivate = input.isPrivate ?? current.isPrivate;

    if (willBePrivate) {
      data.password = input.password;
    }
  }

  return prisma.room.update({ where: { id }, data, select: roomSelect });
};

export const deleteRoom = async (id: string, userId: string) => {
  await assertCanManageRoom(id, userId);
  await prisma.room.delete({ where: { id } });
};
