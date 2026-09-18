import type { PermissionKey } from './bits';

import { ALL_PERMISSIONS, PERMISSION_KEYS, PERMISSIONS } from './bits';

export type PermissionOverwrite = {
  allow: bigint;
  deny: bigint;
};

/** Applies an ordered overwrite chain on top of a base mask: deny first, then allow. */
export const applyOverwrites = (base: bigint, overwrites: PermissionOverwrite[]) =>
  overwrites.reduce((acc, { allow, deny }) => (acc & ~deny) | allow, base);

/**
 * Resolves the effective mask for a member in a channel, following Discord order:
 * base roles, then category role overwrites, category member overwrite,
 * then channel role overwrites, then channel member overwrite.
 * `administrator` short-circuits to every permission.
 */
export const resolvePermissions = (input: {
  basePermissions: bigint;
  categoryRoleOverwrites?: PermissionOverwrite[];
  categoryMemberOverwrite?: PermissionOverwrite;
  channelRoleOverwrites?: PermissionOverwrite[];
  channelMemberOverwrite?: PermissionOverwrite;
  isOwner?: boolean;
}) => {
  if (input.isOwner) return ALL_PERMISSIONS;
  if ((input.basePermissions & PERMISSIONS.administrator) !== 0n) return ALL_PERMISSIONS;

  const chain = [
    ...(input.categoryRoleOverwrites ?? []),
    ...(input.categoryMemberOverwrite ? [input.categoryMemberOverwrite] : []),
    ...(input.channelRoleOverwrites ?? []),
    ...(input.channelMemberOverwrite ? [input.channelMemberOverwrite] : [])
  ];

  return applyOverwrites(input.basePermissions, chain);
};

export const hasPermission = (mask: bigint, permission: PermissionKey) =>
  (mask & PERMISSIONS.administrator) !== 0n || (mask & PERMISSIONS[permission]) !== 0n;

export const hasEveryPermission = (mask: bigint, permissions: PermissionKey[]) =>
  permissions.every((permission) => hasPermission(mask, permission));

export const toPermissionKeys = (mask: bigint) =>
  PERMISSION_KEYS.filter((key) => (mask & PERMISSIONS[key]) !== 0n);

export const fromPermissionKeys = (keys: PermissionKey[]) =>
  keys.reduce((acc, key) => acc | PERMISSIONS[key], 0n);

/** Permission masks cross the wire as decimal strings — JSON has no bigint. */
export const serializePermissions = (mask: bigint) => mask.toString();

export const parsePermissions = (value: string) => {
  try {
    const parsed = BigInt(value);

    return parsed < 0n ? 0n : parsed & ALL_PERMISSIONS;
  } catch {
    return 0n;
  }
};
