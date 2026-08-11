import type { Room, RoomsParticipantsSnapshot } from '@chatovo/schemas';

import { isEmpty, partition, sortBy } from 'remeda';
import { match } from 'ts-pattern';

type RoomsPresenceMap = RoomsParticipantsSnapshot['rooms'];

export type RoomSection = {
  key: 'private' | 'public';
  rooms: Room[];
};

export type RoomsFilter = 'all' | 'live' | 'mine';

export type RoomsFilterCounts = Record<RoomsFilter, number>;

const participantCount = (presence: RoomsPresenceMap, roomId: string) =>
  presence[roomId]?.length ?? 0;

const matchesFilter = (
  room: Room,
  presence: RoomsPresenceMap,
  filter: RoomsFilter,
  currentUserId?: string
) =>
  match(filter)
    .with('all', () => true)
    .with('live', () => participantCount(presence, room.id) > 0)
    .with('mine', () => room.ownerId === currentUserId)
    .exhaustive();

export const filterAndOrderRooms = (
  rooms: Room[],
  presence: RoomsPresenceMap,
  query: string
): Room[] => {
  const normalized = query.trim().toLowerCase();

  const matched = normalized
    ? rooms.filter((room) => room.name.toLowerCase().includes(normalized))
    : rooms;

  return sortBy(
    matched,
    [(room) => participantCount(presence, room.id), 'desc'],
    [(room) => room.name.toLowerCase(), 'asc']
  );
};

export const countRoomsByFilter = (
  rooms: Room[],
  presence: RoomsPresenceMap,
  currentUserId?: string
): RoomsFilterCounts => ({
  all: rooms.length,
  live: rooms.filter((room) => matchesFilter(room, presence, 'live')).length,
  mine: rooms.filter((room) => matchesFilter(room, presence, 'mine', currentUserId)).length
});

export const groupRooms = (
  rooms: Room[],
  presence: RoomsPresenceMap,
  query: string,
  filter: RoomsFilter = 'all',
  currentUserId?: string
): RoomSection[] => {
  const scoped = rooms.filter((room) => matchesFilter(room, presence, filter, currentUserId));
  const ordered = filterAndOrderRooms(scoped, presence, query);
  const [privateRooms, publicRooms] = partition(ordered, (room) => room.isPrivate);

  return (
    [
      { key: 'private', rooms: privateRooms },
      { key: 'public', rooms: publicRooms }
    ] satisfies RoomSection[]
  ).filter((section) => !isEmpty(section.rooms));
};
