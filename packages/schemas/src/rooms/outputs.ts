import { z } from 'zod';

export const roomKindSchema = z.enum(['group', 'dm']);

export const roomSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'Name required')
    .max(64, 'Max 64 chars')
    .regex(/^[\w\s-]+$/, 'Only letters, digits, spaces, _ and -'),
  kind: roomKindSchema,
  isPrivate: z.boolean(),
  ownerId: z.uuid(),
});
