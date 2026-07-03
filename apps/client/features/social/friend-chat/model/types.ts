import type { FriendUser } from '@chatovo/schemas';

export type FriendChatPeer = Pick<FriendUser, 'id' | 'name' | 'avatarUrl' | 'verified'>;

export type FriendChatSession = {
  roomId: string;
  peer: FriendChatPeer;
};
