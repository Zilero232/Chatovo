import { z } from 'zod';

import { ROOM_NAME_MAX_LENGTH } from './limits';

export const roomKindSchema = z.enum(['group', 'dm']);

export const roomSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'Name required')
    .max(ROOM_NAME_MAX_LENGTH, 'Max 64 chars')
    .regex(/^[\w\s-]+$/, 'Only letters, digits, spaces, _ and -'),
  kind: roomKindSchema,
  isPrivate: z.boolean(),
  ownerId: z.uuid()
});
