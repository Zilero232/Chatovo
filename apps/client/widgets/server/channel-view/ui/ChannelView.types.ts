import type { Channel, ChannelTree } from '@chatovo/schemas';

export type ChannelSidePanel = 'members' | 'threads' | null;

export type ChannelViewProps = {
  channel: Channel;
  serverId: string;
  threadId: string | null;
  tree: ChannelTree | undefined;
};
