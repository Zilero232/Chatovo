import type { Channel } from '@chatovo/schemas';

export type ChannelSectionKind = 'text' | 'voice';

export type ChannelSectionProps = {
  activeChannelId: string | null;
  canManage: boolean;
  categoryId: string | null;
  channels: Channel[];
  kind: ChannelSectionKind;
  serverId: string;
  onNavigate?: () => void;
};
