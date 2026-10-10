import type { RememberOwnedRoomsInput } from './owned-rooms-store.types';

const ownedRoomsByUser = new Map<string, string[]>();

export const rememberOwnedRooms = ({ userId, roomIds }: RememberOwnedRoomsInput): void => {
  ownedRoomsByUser.set(userId, roomIds);
};

export const takeOwnedRooms = (userId: string): string[] => {
  const roomIds = ownedRoomsByUser.get(userId) ?? [];

  ownedRoomsByUser.delete(userId);

  return roomIds;
};
