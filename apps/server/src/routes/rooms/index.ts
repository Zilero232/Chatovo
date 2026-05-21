import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoomHandler, getRoomHandler, listRoomsHandler } from './handlers';
import { createRoomRoute, getRoomRoute, listRoomsRoute } from './routes';
import type { Env } from '../shared/types';

export const roomsRouter = new OpenAPIHono<Env>()
  .openapi(listRoomsRoute, listRoomsHandler)
  .openapi(getRoomRoute, getRoomHandler)
  .openapi(createRoomRoute, createRoomHandler);
