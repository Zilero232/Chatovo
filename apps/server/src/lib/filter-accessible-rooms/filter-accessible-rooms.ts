import { match } from 'ts-pattern';

import type { FilterAccessibleRoomsInput } from './filter-accessible-rooms.types';

import { RoomKind } from '../../../generated';
import { basePrisma as prisma } from '../../core';
import { hasRoomGrant } from '../../modules/livekit';

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
    .filter((room) =>
      match(room)
        .with(
          { kind: RoomKind.dm },
          ({ dmUserAId, dmUserBId }) => dmUserAId === userId || dmUserBId === userId
        )
        .with(
          { isPrivate: true },
          ({ id, ownerId }) => ownerId === userId || hasRoomGrant(id, userId)
        )
        .otherwise(() => true)
    )
    .map((room) => room.id);
};
