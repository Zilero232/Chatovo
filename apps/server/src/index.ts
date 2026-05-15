import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { env } from './lib/env';
import { authMiddleware } from './middleware/auth';
import { livekitRouter } from './routes/livekit';
import { roomsRouter } from './routes/rooms';

const app = new OpenAPIHono();

app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const routes = app
  .use('*', logger())
  .use(
    '*',
    cors({
      origin: ['http://localhost:3000', 'tauri://localhost', 'http://tauri.localhost'],
      credentials: true,
    }),
  )
  .get('/health', (c) => c.json({ ok: true }))
  .use('/api/*', authMiddleware)
  .route('/api/rooms', roomsRouter)
  .route('/api/livekit', livekitRouter);

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: { title: 'Solvex API', version: '0.1.0' },
});

app.get('/docs', swaggerUI({ url: '/openapi.json' }));

export type App = typeof routes;

export default {
  port: env.PORT,
  fetch: app.fetch,
};
