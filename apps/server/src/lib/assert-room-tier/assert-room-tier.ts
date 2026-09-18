import { hasPermission } from '@chatovo/schemas';
import { isNonNullish, isNullish } from 'remeda';

import type { AssertRoomTierInput } from './assert-room-tier.types';

import { RoomKind } from '../../../generated';
import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { assertNotBlocked } from '../assert-not-blocked';
import { canAccessRoom } from '../can-access-room';
import { resolveChannelPermissions } from '../resolve-member-permissions';
import { roomAccessSelect } from '../selectors';

/**
 * Loads the room and enforces one access tier, throwing `ROOM_NOT_FOUND` when it is gone.
 * A denied DM reports plain `FORBIDDEN` so a non-member cannot tell the room apart from any other.
 * A room that belongs to a server is a channel, so its own permission mask decides instead.
 */
export const assertRoomTier = async ({
  roomId,
  userId,
  tier
}: AssertRoomTierInput): Promise<void> => {
  await assertNotBlocked(userId);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: roomAccessSelect
  });

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }

  if (isNonNullish(room.serverId)) {
    const permissions = await resolveChannelPermissions({
      serverId: room.serverId,
      userId,
      channelId: roomId
    });

    const required = tier === 'view' ? 'viewChannel' : 'readMessageHistory';

    if (hasPermission(permissions, required)) {
      return;
    }

    throw new AppForbiddenException('PERMISSION_DENIED', 'Channel access denied');
  }

  if (canAccessRoom({ room, userId })) {
    return;
  }

  if (room.kind === RoomKind.dm || tier === 'view') {
    throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
  }

  throw new AppForbiddenException('ROOM_ACCESS_DENIED', 'Room access denied');
};
