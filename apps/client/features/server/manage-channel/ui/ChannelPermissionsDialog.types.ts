import type { Channel } from '@chatovo/schemas';

export type ChannelPermissionsDialogProps = {
  channel: Channel;
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
