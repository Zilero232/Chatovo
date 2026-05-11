import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { env } from '@/env';
import { healthRoute } from '@/routes/health';
import { livekitTokenRoute } from '@/routes/livekit-token';

export const app = new Hono()
  .use('*', logger())
  .use('*', cors({ origin: env.ALLOWED_ORIGIN, allowMethods: ['POST', 'GET', 'OPTIONS'] }))
  .route('/health', healthRoute)
  .route('/token', livekitTokenRoute);

export type AppType = typeof app;
