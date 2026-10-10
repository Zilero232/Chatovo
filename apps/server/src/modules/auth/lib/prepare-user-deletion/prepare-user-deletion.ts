import { WS_CLOSE_CODE } from '@chatovo/schemas';

import { RoomKind } from '../../../../../generated';
import { basePrisma } from '../../../../core';
import { closeUserConnections } from '../../../realtime';
import { rememberOwnedRooms } from '../../owned-rooms-store';

export const prepareUserDeletion = async (userId: string): Promise<void> => {
  closeUserConnections(userId, WS_CLOSE_CODE.blocked, 'Account deleted');

  const ownedRooms = await basePrisma.room.findMany({
    where: { ownerId: userId, kind: RoomKind.group },
    select: { id: true }
  });

  rememberOwnedRooms({ userId, roomIds: ownedRooms.map(({ id }) => id) });
};
