import type { ChannelType, OverwriteTarget } from '../../../generated';

export type ResolveMemberPermissionsInput = {
  serverId: string;
  userId: string;
  channelId?: string;
};

export type MemberPermissionContext = {
  serverId: string;
  memberId: string;
  isOwner: boolean;
  basePermissions: bigint;
  roleIds: string[];
  permissions: bigint;
};

export type ChannelPermissionInput = {
  channelId: string;
  categoryId: string | null;
  channelType: ChannelType;
};

export type OverwriteRow = {
  target: OverwriteTarget;
  roleId: string | null;
  memberId: string | null;
  allow: bigint;
  deny: bigint;
};
