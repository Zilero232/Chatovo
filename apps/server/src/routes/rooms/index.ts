import { OpenAPIHono } from '@hono/zod-openapi';

import type { AuthVars } from '../../middleware/auth';

import { createRoomHandler, deleteRoomHandler, listRoomsHandler } from './handlers';
import { createRoomRoute, deleteRoomRoute, listRoomsRoute } from './routes';

export const roomsRouter = new OpenAPIHono<{ Variables: AuthVars }>()
  .openapi(listRoomsRoute, listRoomsHandler)
  .openapi(createRoomRoute, createRoomHandler)
  .openapi(deleteRoomRoute, deleteRoomHandler);
