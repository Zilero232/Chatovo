import type { ChannelTree, Server } from '@chatovo/schemas';

export type ServerHeaderProps = {
  server: Server | undefined;
  serverId: string;
  tree: ChannelTree | undefined;
};
