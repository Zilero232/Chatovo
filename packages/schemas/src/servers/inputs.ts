import { z } from 'zod';

import { SERVER_DESCRIPTION_MAX_LENGTH, SERVER_NICKNAME_MAX_LENGTH } from './limits';
import {
  hexColorSchema,
  permissionsMaskSchema,
  serverNameSchema,
  serverRoleSchema,
  serverSchema,
  serverSlugSchema
} from './outputs';

export const createServerInputSchema = z.object({
  name: serverNameSchema,
  slug: serverSlugSchema.optional(),
  description: z.string().trim().max(SERVER_DESCRIPTION_MAX_LENGTH).optional(),
  bannerColor: hexColorSchema.optional()
});

export const updateServerInputSchema = serverSchema
  .pick({ name: true, description: true, bannerColor: true, iconUrl: true, systemChannelId: true })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'validation.atLeastOneField'
  });

export const createRoleInputSchema = serverRoleSchema
  .pick({ name: true, color: true, mentionable: true, hoist: true })
  .partial({ color: true, mentionable: true, hoist: true })
  .extend({ permissions: permissionsMaskSchema.optional() });

export const updateRoleInputSchema = createRoleInputSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'validation.atLeastOneField'
  });

export const reorderRolesInputSchema = z.object({
  roles: z.array(z.object({ id: z.uuid(), position: z.number().int().nonnegative() })).min(1)
});

export const updateMemberInputSchema = z
  .object({
    nickname: z.string().trim().max(SERVER_NICKNAME_MAX_LENGTH).nullable().optional(),
    roleIds: z.array(z.uuid()).optional(),
    mutedUntil: z.iso.datetime().nullable().optional()
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'validation.atLeastOneField'
  });

export const createInviteInputSchema = z.object({
  maxUses: z.number().int().positive().max(1000).optional(),
  expiresInMinutes: z
    .number()
    .int()
    .positive()
    .max(60 * 24 * 30)
    .optional()
});

export const banMemberInputSchema = z.object({
  reason: z.string().trim().max(300).optional()
});

export const joinServerInputSchema = z.object({ code: z.string().trim().min(1) });
