import { OpenAPIHono } from '@hono/zod-openapi';

import {
  createRoomHandler,
  deleteRoomHandler,
  getRoomHandler,
  listRoomsHandler,
  updateRoomHandler,
} from './handlers';
import {
  createRoomRoute,
  deleteRoomRoute,
  getRoomRoute,
  listRoomsRoute,
  updateRoomRoute,
} from './routes';

import type { Env } from '../../shared/types';

export const roomsRouter = new OpenAPIHono<Env>()
  .openapi(listRoomsRoute, listRoomsHandler)
  .openapi(getRoomRoute, getRoomHandler)
  .openapi(createRoomRoute, createRoomHandler)
  .openapi(updateRoomRoute, updateRoomHandler)
  .openapi(deleteRoomRoute, deleteRoomHandler);
