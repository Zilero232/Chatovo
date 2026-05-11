const ROOM_PREFIX = 'solvex.room.';

export const readRecentRooms = (): string[] => {
  if (typeof window === 'undefined') return [];
  return Object.keys(sessionStorage)
    .filter((k) => k.startsWith(ROOM_PREFIX))
    .map((k) => k.replace(ROOM_PREFIX, ''));
};
