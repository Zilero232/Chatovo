import type { ChannelTree, PermissionKey } from '@chatovo/schemas';

import { hasPermission, parsePermissions } from '@chatovo/schemas';

/** Reads a channel's effective mask out of the tree the server resolved for this viewer. */
export const readChannelPermissions = (tree: ChannelTree | undefined, channelId: string) =>
  parsePermissions(tree?.channelPermissions[channelId] ?? '0');

export const readServerPermissions = (tree: ChannelTree | undefined) =>
  parsePermissions(tree?.permissions ?? '0');

export const canInChannel = (
  tree: ChannelTree | undefined,
  channelId: string,
  permission: PermissionKey
) => hasPermission(readChannelPermissions(tree, channelId), permission);

export const canOnServer = (tree: ChannelTree | undefined, permission: PermissionKey) =>
  hasPermission(readServerPermissions(tree), permission);
