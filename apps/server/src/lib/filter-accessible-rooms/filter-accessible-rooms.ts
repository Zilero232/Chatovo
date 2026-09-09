import type { FilterAccessibleRoomsInput } from './filter-accessible-rooms.types';

import { basePrisma as prisma } from '../../core';
import { canAccessRoom } from '../can-access-room';
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

  return rooms
    .filter((room) => canAccessRoom({ room, userId, tier: 'access' }))
    .map((room) => room.id);
};
