import type { Channel } from '@chatovo/schemas';

import type { ChannelSidePanel } from '../../ChannelView.types';

export type ChannelHeaderProps = {
  channel: Channel;
  serverId: string;
  sidePanel: ChannelSidePanel;
  threadId: string | null;
  onTogglePanel: (panel: Exclude<ChannelSidePanel, null>) => void;
};
