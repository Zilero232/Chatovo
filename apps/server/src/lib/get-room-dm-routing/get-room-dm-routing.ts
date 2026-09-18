import { basePrisma as prisma } from '../../core';

export const getRoomDmRouting = async (roomId: string) =>
  prisma.room.findUnique({
    where: { id: roomId },
    select: { kind: true, serverId: true, dmUserAId: true, dmUserBId: true }
  });
