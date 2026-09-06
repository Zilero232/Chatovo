import type { FilterAccessibleRoomsInput } from './filter-accessible-rooms.types';

import { basePrisma as prisma } from '../../core';
import { canAccessRoom } from '../can-access-room';

export const filterAccessibleRooms = async ({
  roomIds,
  userId
}: FilterAccessibleRoomsInput): Promise<string[]> => {
  if (roomIds.length === 0) {
    return [];
  }

  const rooms = await prisma.room.findMany({
    where: { id: { in: roomIds } },
    select: {
      id: true,
      kind: true,
      isPrivate: true,
      ownerId: true,
      dmUserAId: true,
      dmUserBId: true
    }
  });

  return rooms
    .filter((room) => canAccessRoom({ room, userId, tier: 'access' }))
    .map((room) => room.id);
};
