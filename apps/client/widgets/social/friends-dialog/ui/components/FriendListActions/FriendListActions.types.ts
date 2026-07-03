import type { FriendUser } from '@chatovo/schemas';

export type FriendListActionsProps = {
  user: FriendUser;
  isCallPending?: boolean;
  onMessage: (user: FriendUser) => void;
  onCall: (userId: string) => void;
  onRemove: (user: FriendUser) => void;
};
