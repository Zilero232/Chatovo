import { OpenAPIHono } from '@hono/zod-openapi';
import { tokenHandler, webhookHandler } from './handlers';
import { tokenRoute } from './routes';
import type { Env } from '../../shared/types';

export const livekitRouter = new OpenAPIHono<Env>()
  .openapi(tokenRoute, tokenHandler)
  .post('/webhook', webhookHandler);
