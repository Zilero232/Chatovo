import type { ServerMember } from '@chatovo/schemas';

export type NicknameDialogProps = {
  member: ServerMember;
  serverId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
