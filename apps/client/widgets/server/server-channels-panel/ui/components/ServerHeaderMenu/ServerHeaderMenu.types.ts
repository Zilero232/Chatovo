import type { ChannelTree, Server } from '@chatovo/schemas';

export type ServerHeaderMenuProps = {
  server: Server;
  serverId: string;
  tree: ChannelTree | undefined;
};
