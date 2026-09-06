import { isNullish } from 'remeda';

import type { AssertCanViewRoomInput } from './assert-can-view-room.types';

import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { assertNotBlocked } from '../assert-not-blocked';
import { canAccessRoom } from '../can-access-room';

/**
 * Guards room metadata (name, kind, isPrivate) rather than its contents.
 * A private group room stays visible so the client can render its password prompt —
 * joining it still requires the password via assertRoomAccess. DM rooms stay members-only.
 */
export const assertCanViewRoom = async ({
  roomId,
  userId
}: AssertCanViewRoomInput): Promise<void> => {
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

  if (!canAccessRoom({ room, userId, tier: 'view' })) {
    throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
  }
};
