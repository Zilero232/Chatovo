import type { FriendUser } from '@chatovo/schemas';

export type FriendChatPeer = Pick<FriendUser, 'avatarUrl' | 'id' | 'name' | 'verified'>;

export type FriendChatSession = {
  peer: FriendChatPeer;
  roomId: string;
};
