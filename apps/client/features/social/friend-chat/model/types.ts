import type { FriendUser } from '@chatovo/schemas';

export type FriendChatPeer = Pick<
  FriendUser,
  'avatarUrl' | 'developer' | 'id' | 'name' | 'verified'
>;
