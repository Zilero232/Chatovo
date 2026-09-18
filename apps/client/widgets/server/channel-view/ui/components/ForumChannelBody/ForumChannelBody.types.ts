import type { Channel } from '@chatovo/schemas';

export type ForumChannelBodyProps = {
  canCreate: boolean;
  canManage: boolean;
  canSend: boolean;
  channel: Channel;
  serverId: string;
  threadId: string | null;
};
