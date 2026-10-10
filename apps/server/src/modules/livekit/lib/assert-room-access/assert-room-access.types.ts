import type { CanAccessRoomRoom } from '../../../../lib';

export type AssertRoomAccessInput = {
  room: CanAccessRoomRoom & { password: string | null };
  userId: string;
  password?: string;
};
