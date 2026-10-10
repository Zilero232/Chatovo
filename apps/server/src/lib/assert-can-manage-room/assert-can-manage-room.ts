import { isNullish } from 'remeda';

import type { AssertCanManageRoomInput } from './assert-can-manage-room.types';

import { RoomKind } from '../../../generated';
import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';

export const assertCanManageRoom = async ({ roomId, userId }: AssertCanManageRoomInput) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { kind: true, ownerId: true, isPrivate: true, name: true }
  });

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }

  if (room.kind !== RoomKind.group || room.ownerId !== userId) {
    throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
  }

  return room;
};
