import type { Channel } from '@chatovo/schemas';

export type ChannelRowMenuProps = {
  canManage: boolean;
  channel: Channel;
  className?: string;
  isMuted: boolean;
  serverId: string;
  siblingIndex: number;
  siblings: Channel[];
};
