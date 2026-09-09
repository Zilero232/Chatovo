import type { FriendEntry } from '@chatovo/schemas';

import type { FriendRoomRef } from '../../../../../lib';

export type FriendsGroupProps = {
  friends: FriendEntry[];
  labelKey: 'offline' | 'online';
  roomByUserId: Map<string, FriendRoomRef>;
  onNavigate?: () => void;
};
