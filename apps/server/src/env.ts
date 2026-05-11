import { z } from 'zod';

const schema = z.object({
  LIVEKIT_API_KEY: z.string().min(1),
  LIVEKIT_API_SECRET: z.string().min(1),
  LIVEKIT_URL: z.string().startsWith('wss://'),
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  ALLOWED_ORIGIN: z.string().default('*'),
});

const parsed = schema.safeParse(Bun.env);

if (!parsed.success) {
  console.error('Invalid server env:', z.treeifyError(parsed.error));
  throw new Error('Missing or invalid server env. See .env.example.');
}

export const env = parsed.data;
