import type { FriendUser } from '@chatovo/schemas';

import type { FriendRoomRef } from '../../../../../lib';

export type DirectMessageItemProps = {
  room?: FriendRoomRef;
  user: FriendUser;
  onNavigate?: () => void;
};
