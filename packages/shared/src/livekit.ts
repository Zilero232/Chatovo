import { z } from 'zod';

export const tokenRequestSchema = z.object({
  room: z.string().trim().min(1, 'room required'),
  createIfMissing: z.boolean().default(false),
});

export const tokenResponseSchema = z.object({
  token: z.string(),
  url: z.string(),
  isAdmin: z.boolean(),
});

export type TokenRequest = z.infer<typeof tokenRequestSchema>;
export type TokenResponse = z.infer<typeof tokenResponseSchema>;
