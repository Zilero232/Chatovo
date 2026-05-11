import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_TOKEN_SERVER_URL: z.url(),
  NEXT_PUBLIC_LIVEKIT_URL: z.string().startsWith('wss://'),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_TOKEN_SERVER_URL: process.env.NEXT_PUBLIC_TOKEN_SERVER_URL,
  NEXT_PUBLIC_LIVEKIT_URL: process.env.NEXT_PUBLIC_LIVEKIT_URL,
});

if (!parsed.success) {
  console.error('Invalid env config:', z.treeifyError(parsed.error));
  throw new Error('Missing or invalid NEXT_PUBLIC_* env variables. See .env.example.');
}

export const env = {
  SUPABASE_URL: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY: parsed.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  TOKEN_SERVER_URL: parsed.data.NEXT_PUBLIC_TOKEN_SERVER_URL,
  LIVEKIT_URL: parsed.data.NEXT_PUBLIC_LIVEKIT_URL,
};
