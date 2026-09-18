import type { ServerMember } from '@chatovo/schemas';

export type TimeoutDialogProps = {
  member: ServerMember;
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
