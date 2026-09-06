import { isNullish } from 'remeda';

import type { AssertCanAccessRoomInput } from './assert-can-access-room.types';

import { RoomKind } from '../../../generated';
import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { assertNotBlocked } from '../assert-not-blocked';
import { canAccessRoom } from '../can-access-room';

export const assertCanAccessRoom = async ({
  roomId,
  userId
}: AssertCanAccessRoomInput): Promise<void> => {
  await assertNotBlocked(userId);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      kind: true,
      isPrivate: true,
      ownerId: true,
      dmUserAId: true,
      dmUserBId: true
    }
  });

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }

  if (canAccessRoom({ room, userId, tier: 'access' })) {
    return;
  }

  if (room.kind === RoomKind.dm) {
    throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
  }

  throw new AppForbiddenException('ROOM_ACCESS_DENIED', 'Room access denied');
};
