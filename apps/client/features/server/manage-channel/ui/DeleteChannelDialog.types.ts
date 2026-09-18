import type { Channel } from '@chatovo/schemas';

export type DeleteChannelDialogProps = {
  channel: Channel;
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};
