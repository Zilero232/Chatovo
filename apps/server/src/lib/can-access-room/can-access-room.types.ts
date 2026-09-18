export type RoomAccessTier = 'access' | 'view';

export type CanAccessRoomRoom = {
  id: string;
  kind: string;
  dmUserAId: string | null;
  dmUserBId: string | null;
};

export type CanAccessRoomInput = {
  room: CanAccessRoomRoom;
  userId: string;
};
