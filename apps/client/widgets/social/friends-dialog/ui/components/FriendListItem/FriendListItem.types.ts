import type { FriendUser } from '@chatovo/schemas';

export type FriendListItemProps = {
  user: FriendUser;
  dmUnread?: number;
  onOpen: (user: FriendUser) => void;
  onRemove: (user: FriendUser) => void;
};
