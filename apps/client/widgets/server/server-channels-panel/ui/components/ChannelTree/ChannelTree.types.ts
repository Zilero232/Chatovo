import type { ChannelGroup } from '@/entities/server/channel';

export type ChannelTreeProps = {
  activeChannelId: string | null;
  canManageChannels: boolean;
  groups: ChannelGroup[];
  isLoading: boolean;
  serverId: string;
  onNavigate?: () => void;
};
