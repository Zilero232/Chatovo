import type { ServerMember } from '@chatovo/schemas';

import type { UseMemberActionsOpenDialog } from '../../../../../model/hooks';

export type MemberMenuDialogsProps = {
  dialog: UseMemberActionsOpenDialog;
  isBanning: boolean;
  isKicking: boolean;
  member: ServerMember;
  serverId: string;
  onBan: () => void;
  onClose: () => void;
  onKick: () => void;
};
