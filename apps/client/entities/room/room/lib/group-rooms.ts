import { isEmpty, partition, sortBy } from 'remeda';
import type { Room, RoomsParticipantsSnapshot } from '@chatovo/schemas';

type RoomsPresenceMap = RoomsParticipantsSnapshot['rooms'];

export type RoomSection = {
  key: 'private' | 'public';
  rooms: Room[];
};

const participantCount = (presence: RoomsPresenceMap, roomId: string) => {
  return presence[roomId]?.length ?? 0;
};

export const filterAndOrderRooms = (
  rooms: Room[],
  presence: RoomsPresenceMap,
  query: string,
): Room[] => {
  const normalized = query.trim().toLowerCase();

  const matched = normalized
    ? rooms.filter((room) => room.name.toLowerCase().includes(normalized))
    : rooms;

  return sortBy(
    matched,
    [(room) => participantCount(presence, room.id), 'desc'],
    [(room) => room.name.toLowerCase(), 'asc'],
  );
};

export const groupRooms = (
  rooms: Room[],
  presence: RoomsPresenceMap,
  query: string,
): RoomSection[] => {
  const ordered = filterAndOrderRooms(rooms, presence, query);
  const [privateRooms, publicRooms] = partition(ordered, (room) => room.isPrivate);

  return (
    [
      { key: 'private', rooms: privateRooms },
      { key: 'public', rooms: publicRooms },
    ] satisfies RoomSection[]
  ).filter((section) => !isEmpty(section.rooms));
};
