import type { ServerMember, ServerRole } from '@chatovo/schemas';

export type MemberRowProps = {
  canBan: boolean;
  canKick: boolean;
  canManageNickname: boolean;
  canManageRoles: boolean;
  canTimeout: boolean;
  isOwner: boolean;
  member: ServerMember;
  roles: ServerRole[];
  serverId: string;
};
