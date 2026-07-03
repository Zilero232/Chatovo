import { isNonNullish } from 'remeda';
import { prisma } from '../../core';
import { assertCanManageRoom, getUserDisplayName, roomSelect } from '../../lib';
import { notifyRoomCreated, notifyRoomDeleted } from '../telegram';
import type { CreateRoomRequest, UpdateRoomRequest } from '@chatovo/schemas';
import type { Prisma } from '../../../generated';

export const listRooms = () => {
  return prisma.room.findMany({
    where: { kind: 'group' },
    orderBy: { createdAt: 'desc' },
    select: roomSelect,
  });
};

export const getRoom = (id: string) => {
  return prisma.room.findUnique({ where: { id }, select: roomSelect });
};

export const createRoom = async (input: CreateRoomRequest, ownerId: string) => {
  const { isPrivate, name, password } = input;

  // Public rooms never carry a password — drop whatever the client sent.
  const storedPassword = isPrivate ? (password ?? null) : null;

  const room = await prisma.room.create({
    data: { name, isPrivate, password: storedPassword, ownerId },
    select: roomSelect,
  });

  getUserDisplayName(ownerId).then((owner) =>
    notifyRoomCreated({
      roomName: room.name,
      ownerName: owner,
      isPrivate: room.isPrivate,
      password: storedPassword,
    }),
  );

  return room;
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
  const room = await assertCanManageRoom(id, userId);
  const deleted = await prisma.room.delete({ where: { id }, select: { name: true } });

  getUserDisplayName(room.ownerId).then((owner) =>
    notifyRoomDeleted({ roomName: deleted.name, ownerName: owner }),
  );
};
