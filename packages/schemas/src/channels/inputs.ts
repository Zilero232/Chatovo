import { z } from 'zod';

import { permissionsMaskSchema } from '../servers/outputs';
import {
  categorySchema,
  channelSchema,
  overwriteTargetSchema,
  threadSchema,
  threadTagSchema
} from './outputs';

export const createChannelInputSchema = channelSchema
  .pick({
    name: true,
    type: true,
    categoryId: true,
    topic: true,
    slowMode: true,
    nsfw: true,
    userLimit: true,
    isPrivate: true
  })
  .partial({
    categoryId: true,
    topic: true,
    slowMode: true,
    nsfw: true,
    userLimit: true,
    isPrivate: true
  });

export const updateChannelInputSchema = createChannelInputSchema
  .omit({ type: true })
  .partial()
  .extend({ position: z.number().int().nonnegative().optional() })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'validation.atLeastOneField'
  });

export const createCategoryInputSchema = categorySchema.pick({ name: true });

export const updateCategoryInputSchema = categorySchema
  .pick({ name: true, position: true })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'validation.atLeastOneField'
  });

/**
 * Drag-and-drop reorder: each entry states where a channel lands and, when the
 * drop crossed a category boundary, which category now owns it.
 */
export const reorderChannelsInputSchema = z.object({
  channels: z
    .array(
      z.object({
        id: z.uuid(),
        position: z.number().int().nonnegative(),
        categoryId: z.uuid().nullable().optional()
      })
    )
    .min(1)
});

export const reorderCategoriesInputSchema = z.object({
  categories: z.array(z.object({ id: z.uuid(), position: z.number().int().nonnegative() })).min(1)
});

export const putOverwriteInputSchema = z
  .object({
    target: overwriteTargetSchema,
    roleId: z.uuid().optional(),
    memberId: z.uuid().optional(),
    allow: permissionsMaskSchema,
    deny: permissionsMaskSchema
  })
  .refine(
    (data) =>
      data.target === 'role' ? !!data.roleId && !data.memberId : !!data.memberId && !data.roleId,
    { message: 'validation.overwriteTargetMismatch', path: ['target'] }
  );

export const createThreadInputSchema = threadSchema
  .pick({ name: true })
  .extend({ tagIds: z.array(z.uuid()).optional(), firstMessage: z.string().trim().optional() });

export const updateThreadInputSchema = threadSchema
  .pick({ name: true, pinned: true, locked: true })
  .partial()
  .extend({ archived: z.boolean().optional(), tagIds: z.array(z.uuid()).optional() })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'validation.atLeastOneField'
  });

export const createThreadTagInputSchema = threadTagSchema
  .pick({ name: true, emoji: true })
  .partial({
    emoji: true
  });

export const markChannelReadInputSchema = z.object({ lastReadAt: z.iso.datetime().optional() });
