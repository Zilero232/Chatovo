import { isNullish } from 'remeda';

import type { AssertCanAccessDmRoomInput } from './assert-can-access-dm-room.types';

import { RoomKind } from '../../../generated';
import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';

export const assertCanAccessDmRoom = async ({
  roomId,
  userId
}: AssertCanAccessDmRoomInput): Promise<void> => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { kind: true, dmUserAId: true, dmUserBId: true }
  });

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }

  if (room.kind !== RoomKind.dm) {
    return;
  }

  if (room.dmUserAId !== userId && room.dmUserBId !== userId) {
    throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
  }
};
