import ky from 'ky';

import { env } from '@/shared/config';

export const api = ky.create({
  prefix: env.TOKEN_SERVER_URL,
  retry: { limit: 1 },
  timeout: 10_000,
});
