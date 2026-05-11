import { z } from 'zod';

const schema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  VITE_TOKEN_SERVER_URL: z.url(),
  VITE_LIVEKIT_URL: z.string().startsWith('wss://'),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid env config:', z.treeifyError(parsed.error));
  throw new Error('Missing or invalid VITE_* env variables. See .env.example.');
}

export const env = parsed.data;
