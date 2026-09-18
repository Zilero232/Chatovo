import type { ServerRole } from '@chatovo/schemas';

import type { UseMemberActionsOpenDialog } from '../../../../../model/hooks';

export type MemberMenuItemsProps = {
  assignable: ServerRole[];
  canBan: boolean;
  canKick: boolean;
  canManageNickname: boolean;
  canManageRoles: boolean;
  canTimeout: boolean;
  roleIds: string[];
  onOpenDialog: (dialog: UseMemberActionsOpenDialog) => void;
  onToggleRole: (roleId: string, checked: boolean) => void;
};
