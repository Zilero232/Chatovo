import type { Channel } from '@chatovo/schemas';

export type ChannelRowProps = {
  canManage: boolean;
  channel: Channel;
  isActive: boolean;
  serverId: string;
  siblingIndex: number;
  siblings: Channel[];
  onNavigate?: () => void;
};
