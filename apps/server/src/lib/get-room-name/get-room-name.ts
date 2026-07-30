import { basePrisma as prisma } from '../../core';

export const getRoomName = async (roomId: string): Promise<string> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { name: true } });

  return room?.name ?? roomId;
};
