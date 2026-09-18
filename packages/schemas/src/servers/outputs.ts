import { z } from 'zod';

import {
  ROLE_NAME_MAX_LENGTH,
  SERVER_DESCRIPTION_MAX_LENGTH,
  SERVER_NAME_MAX_LENGTH,
  SERVER_NICKNAME_MAX_LENGTH,
  SERVER_SLUG_MAX_LENGTH
} from './limits';

export const serverMemberRoleSchema = z.enum(['owner', 'admin', 'member']);

export const hexColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i, 'validation.hexColor');

export const permissionsMaskSchema = z.string().regex(/^\d+$/, 'validation.permissionsMask');

export const serverNameSchema = z
  .string()
  .trim()
  .min(2, 'validation.serverNameMin')
  .max(SERVER_NAME_MAX_LENGTH, 'validation.serverNameMax');

export const serverSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, 'validation.serverSlugMin')
  .max(SERVER_SLUG_MAX_LENGTH, 'validation.serverSlugMax')
  .regex(/^[a-z0-9-]+$/, 'validation.serverSlugChars');

export const serverSchema = z.object({
  id: z.uuid(),
  name: serverNameSchema,
  slug: serverSlugSchema,
  description: z.string().max(SERVER_DESCRIPTION_MAX_LENGTH).nullable(),
  iconUrl: z.string().nullable(),
  bannerColor: hexColorSchema.nullable(),
  ownerId: z.string(),
  systemChannelId: z.uuid().nullable(),
  memberCount: z.number().int().nonnegative(),
  createdAt: z.iso.datetime()
});

export const serverRoleSchema = z.object({
  id: z.uuid(),
  serverId: z.uuid(),
  name: z.string().trim().min(1).max(ROLE_NAME_MAX_LENGTH),
  color: hexColorSchema.nullable(),
  position: z.number().int().nonnegative(),
  permissions: permissionsMaskSchema,
  isDefault: z.boolean(),
  mentionable: z.boolean(),
  hoist: z.boolean()
});

export const serverMemberSchema = z.object({
  id: z.uuid(),
  serverId: z.uuid(),
  userId: z.string(),
  displayName: z.string(),
  nickname: z.string().max(SERVER_NICKNAME_MAX_LENGTH).nullable(),
  avatarUrl: z.string().nullable(),
  role: serverMemberRoleSchema,
  roleIds: z.array(z.uuid()),
  mutedUntil: z.iso.datetime().nullable(),
  joinedAt: z.iso.datetime()
});

export const serverInviteSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  serverId: z.uuid(),
  creatorId: z.string().nullable(),
  maxUses: z.number().int().positive().nullable(),
  uses: z.number().int().nonnegative(),
  expiresAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime()
});

export const serverBanSchema = z.object({
  id: z.uuid(),
  serverId: z.uuid(),
  userId: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  reason: z.string().nullable(),
  bannedById: z.string().nullable(),
  createdAt: z.iso.datetime()
});

export const voiceChannelRefSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  serverId: z.uuid(),
  serverName: z.string()
});

export const serverInvitePreviewSchema = z.object({
  code: z.string(),
  serverId: z.uuid(),
  serverName: z.string(),
  serverIconUrl: z.string().nullable(),
  memberCount: z.number().int().nonnegative(),
  isMember: z.boolean()
});
