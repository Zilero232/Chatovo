import { z } from 'zod';

import { displayNameSchema } from '../auth/inputs';

export const updateProfileInputSchema = z.object({
  displayName: z.string(),
  profileUrl: z.string(),
  bannerColor: z.string().nullable(),
  bio: z.string(),
  avatar: z.instanceof(File).nullable().optional()
});

/** Тело `POST /users/profile` — multipart, поэтому все поля строковые. */
export const updateProfileBodySchema = z.object({
  displayName: displayNameSchema,
  profileUrl: z.string(),
  bannerColor: z.string(),
  bio: z.string().max(280, 'validation.bioMax'),
  removeAvatar: z.string().optional()
});
