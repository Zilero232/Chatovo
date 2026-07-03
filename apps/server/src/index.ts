import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { serveStatic, websocket } from 'hono/bun';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { StatusCodes } from 'http-status-codes';
import { allowedOrigins } from './config/cors';
import { env } from './core';
import { backfillMissingFriendTags } from './lib';
import { authMiddleware, friendsAuthMiddleware, livekitAuthMiddleware } from './middleware';
import { auth } from './modules/auth';
import { chatRouter } from './modules/chat';
import { feedbackRouter } from './modules/feedback';
import { friendsRouter } from './modules/friends';
import { githubRouter } from './modules/github';
import { livekitRouter } from './modules/livekit';
import { pushRouter } from './modules/push';
import { realtimeWsRoute } from './modules/realtime';
import { roomsRouter } from './modules/rooms';
import { UPLOADS_DIR } from './modules/uploads';
import { usersRouter } from './modules/users';

const serveUploads = serveStatic({
  root: UPLOADS_DIR,
  rewriteRequestPath: (path) => path.replace(/^\/uploads/, ''),
});

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        { error: result.error.issues[0]?.message ?? 'Invalid input' },
        StatusCodes.BAD_REQUEST,
      );
    }
  },
});

await backfillMissingFriendTags();

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
      origin: allowedOrigins,
      credentials: true,
      exposeHeaders: ['set-auth-token'],
    }),
  )
  .get('/health', (c) => c.json({ ok: true }))
  .on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
  .use('/uploads/*', serveUploads)
  .use('/rooms/*', authMiddleware)
  .use('/users/*', authMiddleware)
  .use('/chat/*', authMiddleware)
  .use('/feedback/*', authMiddleware)
  .use('/push/*', authMiddleware)
  .use('/friends/*', friendsAuthMiddleware)
  .use('/livekit/*', livekitAuthMiddleware)
  .route('/rooms', roomsRouter)
  .route('/users', usersRouter)
  .route('/chat', chatRouter)
  .route('/feedback', feedbackRouter)
  .route('/push', pushRouter)
  .route('/friends', friendsRouter)
  .route('/github', githubRouter)
  .route('/livekit', livekitRouter)
  .get('/realtime', realtimeWsRoute);

// Single place that turns thrown errors into HTTP responses. HTTPExceptions
// carry their own status; anything else is an unexpected failure -> 500.
app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ error: error.message }, error.status);
  }

  return c.json({ error: 'Internal server error' }, StatusCodes.INTERNAL_SERVER_ERROR);
});

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: { title: 'Chatovo API', version: '0.1.0' },
});

app.get('/docs', swaggerUI({ url: '/openapi.json' }));

export type App = typeof routes;

export default {
  port: env.PORT,
  fetch: app.fetch,
  websocket,
};
