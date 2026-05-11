import ky from 'ky';

import { env } from '@/shared/config';

export const api = ky.create({
  timeout: 10_000,
  retry: { limit: 1 },
  prefix: env.NEXT_PUBLIC_TOKEN_SERVER_URL,
});
