export type RoomAccessTier = 'access' | 'view';

export type CanAccessRoomRoom = {
  id: string;
  kind: string;
  isPrivate: boolean;
  ownerId: string | null;
  dmUserAId: string | null;
  dmUserBId: string | null;
};

export type CanAccessRoomInput = {
  room: CanAccessRoomRoom;
  userId: string;
  tier: RoomAccessTier;
};
