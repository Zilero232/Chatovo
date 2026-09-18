import type { PermissionKey } from '@chatovo/schemas';

export type AssertServerPermissionInput = {
  serverId: string;
  userId: string;
  permission: PermissionKey;
};

export type AssertChannelPermissionInput = {
  channelId: string;
  userId: string;
  permission: PermissionKey;
};

export type AssertMemberHierarchyInput = {
  serverId: string;
  actorId: string;
  targetUserId: string;
};
