import { z } from 'zod';

import { permissionsMaskSchema } from '../servers/outputs';
import {
  CATEGORY_NAME_MAX_LENGTH,
  CHANNEL_NAME_MAX_LENGTH,
  CHANNEL_TOPIC_MAX_LENGTH,
  SLOW_MODE_MAX_SECONDS,
  THREAD_NAME_MAX_LENGTH,
  THREAD_TAG_NAME_MAX_LENGTH,
  VOICE_USER_LIMIT_MAX
} from './limits';

export const channelTypeSchema = z.enum(['text', 'voice', 'announcement', 'forum']);

export const overwriteTargetSchema = z.enum(['role', 'member']);

export const channelNameSchema = z
  .string()
  .trim()
  .min(1, 'validation.channelNameMin')
  .max(CHANNEL_NAME_MAX_LENGTH, 'validation.channelNameMax')
  .regex(/^[\w\s-]+$/, 'validation.channelNameChars');

export const channelOverwriteSchema = z.object({
  id: z.uuid(),
  target: overwriteTargetSchema,
  roleId: z.uuid().nullable(),
  memberId: z.uuid().nullable(),
  allow: permissionsMaskSchema,
  deny: permissionsMaskSchema
});

export const channelSchema = z.object({
  id: z.uuid(),
  serverId: z.uuid().nullable(),
  categoryId: z.uuid().nullable(),
  name: channelNameSchema,
  type: channelTypeSchema,
  topic: z.string().max(CHANNEL_TOPIC_MAX_LENGTH).nullable(),
  position: z.number().int().nonnegative(),
  slowMode: z.number().int().min(0).max(SLOW_MODE_MAX_SECONDS),
  nsfw: z.boolean(),
  userLimit: z.number().int().min(1).max(VOICE_USER_LIMIT_MAX).nullable(),
  isPrivate: z.boolean(),
  archivedAt: z.iso.datetime().nullable()
});

export const categorySchema = z.object({
  id: z.uuid(),
  serverId: z.uuid(),
  name: z.string().trim().min(1).max(CATEGORY_NAME_MAX_LENGTH),
  position: z.number().int().nonnegative()
});

export const threadTagSchema = z.object({
  id: z.uuid(),
  channelId: z.uuid(),
  name: z.string().trim().min(1).max(THREAD_TAG_NAME_MAX_LENGTH),
  emoji: z.string().nullable()
});

export const threadSchema = z.object({
  id: z.uuid(),
  channelId: z.uuid(),
  name: z.string().trim().min(1).max(THREAD_NAME_MAX_LENGTH),
  creatorId: z.string().nullable(),
  pinned: z.boolean(),
  locked: z.boolean(),
  archivedAt: z.iso.datetime().nullable(),
  messageCount: z.number().int().nonnegative(),
  lastMessageAt: z.iso.datetime(),
  tagIds: z.array(z.uuid())
});

export const channelReadStateSchema = z.object({
  channelId: z.uuid(),
  lastReadAt: z.iso.datetime(),
  mentionCount: z.number().int().nonnegative(),
  mutedUntil: z.iso.datetime().nullable(),
  hasUnread: z.boolean()
});

/** A server's full channel tree, as the sidebar renders it in one request. */
export const channelTreeSchema = z.object({
  serverId: z.uuid(),
  categories: z.array(categorySchema),
  channels: z.array(channelSchema),
  permissions: permissionsMaskSchema,
  channelPermissions: z.record(z.uuid(), permissionsMaskSchema)
});
