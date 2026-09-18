import type { ServerMember, ServerRole } from '@chatovo/schemas';

export type MemberMenuProps = {
  canBan: boolean;
  canKick: boolean;
  canManageNickname: boolean;
  canManageRoles: boolean;
  canTimeout: boolean;
  member: ServerMember;
  roles: ServerRole[];
  serverId: string;
};
