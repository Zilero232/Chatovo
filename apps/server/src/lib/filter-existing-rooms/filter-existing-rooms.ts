import { basePrisma as prisma } from '../../core';

export const filterExistingRooms = async (roomIds: string[]): Promise<string[]> => {
  if (roomIds.length === 0) {
    return [];
  }

  const rooms = await prisma.room.findMany({
    where: { id: { in: roomIds } },
    select: { id: true }
  });

  return rooms.map((room) => room.id);
};
