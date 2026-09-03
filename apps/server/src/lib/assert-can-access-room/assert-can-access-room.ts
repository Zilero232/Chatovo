import { isNullish } from 'remeda';
import { match } from 'ts-pattern';

import type { AssertCanAccessRoomInput } from './assert-can-access-room.types';

import { RoomKind } from '../../../generated';
import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { hasRoomGrant } from '../../modules/livekit';
import { assertNotBlocked } from '../assert-not-blocked';

export const assertCanAccessRoom = async ({
  roomId,
  userId
}: AssertCanAccessRoomInput): Promise<void> => {
  await assertNotBlocked(userId);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { kind: true, isPrivate: true, ownerId: true, dmUserAId: true, dmUserBId: true }
  });

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }

  match(room)
    .with({ kind: RoomKind.dm }, ({ dmUserAId, dmUserBId }) => {
      if (dmUserAId !== userId && dmUserBId !== userId) {
        throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
      }
    })
    .with({ isPrivate: true }, ({ ownerId }) => {
      if (ownerId === userId) {
        return;
      }

      if (!hasRoomGrant(roomId, userId)) {
        throw new AppForbiddenException('ROOM_ACCESS_DENIED', 'Room access denied');
      }
    })
    .otherwise(() => undefined);
};
