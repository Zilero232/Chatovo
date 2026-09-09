import type { RoomAccessTier } from '../can-access-room';

export type AssertRoomTierInput = {
  roomId: string;
  tier: RoomAccessTier;
  userId: string;
};
