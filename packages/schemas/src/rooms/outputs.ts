import { z } from 'zod';

// Canonical room shape — the row clients see (no password). Inputs derive from
// this via `.pick()` / `.partial()` so field rules stay in one place.
export const roomSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'Name required')
    .max(64, 'Max 64 chars')
    .regex(/^[\w\s-]+$/, 'Only letters, digits, spaces, _ and -'),
  kind: z.enum(['group', 'dm']),
  isPrivate: z.boolean(),
  ownerId: z.uuid(),
});
