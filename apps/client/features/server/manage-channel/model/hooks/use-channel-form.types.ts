import type { Channel } from '@chatovo/schemas';

export type UseChannelFormInput = {
  serverId: string;
  channel?: Channel | null;
  categoryId?: string | null;
  onDone?: () => void;
};
