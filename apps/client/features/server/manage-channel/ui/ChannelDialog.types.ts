import type { Channel } from '@chatovo/schemas';

export type ChannelDialogProps = {
  channel?: Channel | null;
  categoryId?: string | null;
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
