import { describe, expect, it } from 'vitest';

import { ALL_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, PERMISSIONS } from '../bits';
import {
  applyOverwrites,
  fromPermissionKeys,
  hasPermission,
  parsePermissions,
  resolvePermissions,
  serializePermissions,
  toPermissionKeys
} from '../lib';

describe('permissions', () => {
  it('serializes a mask to a decimal string and back', () => {
    const mask = PERMISSIONS.viewChannel | PERMISSIONS.sendMessages;

    expect(parsePermissions(serializePermissions(mask))).toBe(mask);
  });

  it('parses garbage and negatives as an empty mask', () => {
    expect(parsePermissions('not-a-number')).toBe(0n);
    expect(parsePermissions('-5')).toBe(0n);
  });

  it('drops unknown bits when parsing', () => {
    const outOfRange = 1n << 60n;

    expect(parsePermissions((ALL_PERMISSIONS | outOfRange).toString())).toBe(ALL_PERMISSIONS);
  });

  it('round-trips keys through a mask', () => {
    const keys = ['connect', 'speak', 'manageRoles'] as const;

    expect(toPermissionKeys(fromPermissionKeys([...keys]))).toEqual([
      'manageRoles',
      'connect',
      'speak'
    ]);
  });

  it('applies deny before allow inside one overwrite', () => {
    const base = PERMISSIONS.viewChannel | PERMISSIONS.sendMessages;
    const bit = PERMISSIONS.sendMessages;

    expect(applyOverwrites(base, [{ allow: bit, deny: bit }])).toBe(base);
  });

  it('lets a channel member overwrite beat a category role deny', () => {
    const base = DEFAULT_ROLE_PERMISSIONS;

    const resolved = resolvePermissions({
      basePermissions: base,
      categoryRoleOverwrites: [{ allow: 0n, deny: PERMISSIONS.viewChannel }],
      channelMemberOverwrite: { allow: PERMISSIONS.viewChannel, deny: 0n }
    });

    expect(hasPermission(resolved, 'viewChannel')).toBe(true);
  });

  it('lets a channel role deny beat a category allow', () => {
    const resolved = resolvePermissions({
      basePermissions: 0n,
      categoryRoleOverwrites: [{ allow: PERMISSIONS.sendMessages, deny: 0n }],
      channelRoleOverwrites: [{ allow: 0n, deny: PERMISSIONS.sendMessages }]
    });

    expect(hasPermission(resolved, 'sendMessages')).toBe(false);
  });

  it('short-circuits administrator and owner to everything', () => {
    expect(resolvePermissions({ basePermissions: PERMISSIONS.administrator })).toBe(
      ALL_PERMISSIONS
    );
    expect(resolvePermissions({ basePermissions: 0n, isOwner: true })).toBe(ALL_PERMISSIONS);
    expect(hasPermission(PERMISSIONS.administrator, 'banMembers')).toBe(true);
  });
});
