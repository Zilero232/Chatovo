import { OpenAPIHono } from '@hono/zod-openapi';

import type { AuthVars } from '../../middleware/auth';

import { roomParticipantsHandler, tokenHandler } from './handlers';
import { roomParticipantsRoute, tokenRoute } from './routes';

export const livekitRouter = new OpenAPIHono<{ Variables: AuthVars }>()
  .openapi(tokenRoute, tokenHandler)
  .openapi(roomParticipantsRoute, roomParticipantsHandler);
