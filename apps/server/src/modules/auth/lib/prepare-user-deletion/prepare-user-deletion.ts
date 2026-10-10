import { WS_CLOSE_CODE } from '@chatovo/schemas';

import { RoomKind } from '../../../../../generated';
import { basePrisma } from '../../../../core';
import { closeUserConnections } from '../../../realtime';

const ownedRoomsByUser = new Map<string, string[]>();

export const prepareUserDeletion = async (userId: string): Promise<void> => {
  closeUserConnections(userId, WS_CLOSE_CODE.blocked, 'Account deleted');

  const ownedRooms = await basePrisma.room.findMany({
    where: { ownerId: userId, kind: RoomKind.group },
    select: { id: true }
  });

  ownedRoomsByUser.set(
    userId,
    ownedRooms.map(({ id }) => id)
  );
};

export const takeOwnedRooms = (userId: string): string[] => {
  const roomIds = ownedRoomsByUser.get(userId) ?? [];

  ownedRoomsByUser.delete(userId);

  return roomIds;
};
