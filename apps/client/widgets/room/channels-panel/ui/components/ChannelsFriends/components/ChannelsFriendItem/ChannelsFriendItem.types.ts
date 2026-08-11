import type { FriendUser } from '@chatovo/schemas';

export type ChannelsFriendItemProps = {
  room?: { id: string; name: string };
  user: FriendUser;
  onNavigate?: () => void;
};
