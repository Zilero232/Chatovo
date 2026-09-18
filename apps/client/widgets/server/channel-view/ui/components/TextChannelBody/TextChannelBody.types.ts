import type { Channel } from '@chatovo/schemas';

export type TextChannelBodyProps = {
  canModerate: boolean;
  canSend: boolean;
  channel: Channel;
  serverId: string;
  threadId: string | null;
};
