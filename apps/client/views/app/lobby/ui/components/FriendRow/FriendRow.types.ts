import type { FriendEntry } from '@chatovo/schemas';

import type { FriendRoomRef } from '@/widgets/room/channels-panel';

export type FriendRowProps = {
  entry: FriendEntry;
  room: FriendRoomRef | null;
};
