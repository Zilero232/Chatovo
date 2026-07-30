import { isNullish } from 'remeda';

import { AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';

export const assertRoomExists = async (roomId: string): Promise<void> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { id: true } });

  if (isNullish(room)) {
    throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
  }
};
