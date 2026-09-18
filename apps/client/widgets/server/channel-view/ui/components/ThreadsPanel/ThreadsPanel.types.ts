import type { Channel } from '@chatovo/schemas';

export type ThreadsPanelProps = {
  canCreate: boolean;
  canManage: boolean;
  channel: Channel;
  serverId: string;
  threadId: string | null;
};
