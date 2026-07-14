import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { isNullish } from 'remeda';

import { assertCanAccessDmRoom } from '../../lib';
import { createRoom, deleteRoom, getRoom, listRooms, updateRoom } from './rooms.service';

import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type {
  createRoomRoute,
  deleteRoomRoute,
  getRoomRoute,
  listRoomsRoute,
  updateRoomRoute,
} from './routes';

export const listRoomsHandler: RouteHandler<typeof listRoomsRoute, Env> = async (c) => {
  return c.json(await listRooms(), StatusCodes.OK);
};

export const getRoomHandler: RouteHandler<typeof getRoomRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');
  const userId = c.get('userId');

  await assertCanAccessDmRoom(id, userId);
  const room = await getRoom(id);

  if (isNullish(room)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Room not found' });
  }

  return c.json(room, StatusCodes.OK);
};

export const createRoomHandler: RouteHandler<typeof createRoomRoute, Env> = async (c) => {
  const room = await createRoom(c.req.valid('json'), c.get('userId'));

  return c.json(room, StatusCodes.CREATED);
};

export const updateRoomHandler: RouteHandler<typeof updateRoomRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');
  const room = await updateRoom(id, c.req.valid('json'), c.get('userId'));

  return c.json(room, StatusCodes.OK);
};

export const deleteRoomHandler: RouteHandler<typeof deleteRoomRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');

  await deleteRoom(id, c.get('userId'));

  return c.body(null, 204);
};
