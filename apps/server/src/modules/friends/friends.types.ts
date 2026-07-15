import type { FriendCallStatus, FriendUser } from '@chatovo/schemas';

export type PendingFriendCall = {
  roomId: string;
  caller: FriendUser;
  callee: FriendUser;
  calleeId: string;
  status: FriendCallStatus;
  expiresAt: number;
};
