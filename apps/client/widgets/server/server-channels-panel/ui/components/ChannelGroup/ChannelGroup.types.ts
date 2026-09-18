import type { ChannelGroup } from '@/entities/server/channel';

export type ChannelGroupProps = {
  activeChannelId: string | null;
  canManage: boolean;
  collapsed: boolean;
  group: ChannelGroup;
  serverId: string;
  onNavigate?: () => void;
  onToggle: () => void;
};
