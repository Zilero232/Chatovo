import { entries, indexBy, isNullish, partition, sortBy } from 'remeda';

import type {
  FriendRoomRef,
  FriendsByPresence,
  GroupFriendsByPresenceInput
} from './group-friends-by-presence.types';

const buildRoomByUserId = ({
  presence,
  rooms
}: Pick<GroupFriendsByPresenceInput, 'presence' | 'rooms'>) => {
  const roomsById = indexBy(rooms, (room) => room.id);
  const roomByUserId = new Map<string, FriendRoomRef>();

  entries(presence).forEach(([roomId, participants]) => {
    const room = roomsById[roomId];

    if (isNullish(room)) {
      return;
    }

    participants.forEach((participant) => {
      roomByUserId.set(participant.identity, { id: room.id, name: room.name });
    });
  });

  return roomByUserId;
};

/** Splits friends into online (or in a room) and offline, each sorted by room, presence and name. */
export const groupFriendsByPresence = ({
  friends,
  presence,
  rooms
}: GroupFriendsByPresenceInput): FriendsByPresence => {
  const roomByUserId = buildRoomByUserId({ presence, rooms });

  const sorted = sortBy(
    friends,
    (entry) => (roomByUserId.has(entry.user.id) ? 0 : 1),
    (entry) => (entry.user.isOnline ? 0 : 1),
    (entry) => entry.user.name.toLowerCase()
  );

  const [online, offline] = partition(
    sorted,
    (entry) => entry.user.isOnline || roomByUserId.has(entry.user.id)
  );

  return { online, offline, roomByUserId };
};
