import { hasPermission } from '@chatovo/schemas';
import { isNonNullish, isNullish } from 'remeda';

import type { FilterAccessibleRoomsInput } from './filter-accessible-rooms.types';

import { basePrisma as prisma } from '../../core';
import { canAccessRoom } from '../can-access-room';
import { resolveServerChannelPermissions } from '../resolve-member-permissions';
import { roomAccessSelect } from '../selectors';

export const filterAccessibleRooms = async ({
  roomIds,
  userId
}: FilterAccessibleRoomsInput): Promise<string[]> => {
  if (roomIds.length === 0) {
    return [];
  }

  const rooms = await prisma.room.findMany({
    where: { id: { in: roomIds } },
    select: roomAccessSelect
  });

  const serverIds = [...new Set(rooms.map((room) => room.serverId).filter(isNonNullish))];

  const masksByServer = new Map(
    await Promise.all(
      serverIds.map(async (serverId) => {
        const { channelPermissions } = await resolveServerChannelPermissions({ serverId, userId });

        return [serverId, channelPermissions] as const;
      })
    )
  );

  return rooms
    .filter((room) => {
      if (isNullish(room.serverId)) {
        return canAccessRoom({ room, userId });
      }

      const permissions = masksByServer.get(room.serverId)?.get(room.id);

      return isNonNullish(permissions) && hasPermission(permissions, 'readMessageHistory');
    })
    .map((room) => room.id);
};
