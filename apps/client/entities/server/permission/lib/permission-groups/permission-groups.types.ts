import type { PermissionKey } from '@chatovo/schemas';

export type PermissionGroupKey = 'advanced' | 'general' | 'membership' | 'text' | 'voice';

export type PermissionGroup = {
  key: PermissionGroupKey;
  permissions: PermissionKey[];
};

export type OverwriteState = 'allow' | 'deny' | 'inherit';
