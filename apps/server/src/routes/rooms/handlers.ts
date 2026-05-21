import { hashPassword } from '../../lib/password';
import { prisma } from '../../lib/prisma';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../shared/types';
import type { createRoomRoute, getRoomRoute, listRoomsRoute } from './routes';

export const listRoomsHandler: RouteHandler<typeof listRoomsRoute, Env> = async (c) => {
  const rooms = await prisma.room.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, isPrivate: true },
  });

  return c.json(rooms, 200);
};

export const getRoomHandler: RouteHandler<typeof getRoomRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');

  const room = await prisma.room.findUnique({
    where: { id },
    select: { id: true, name: true, isPrivate: true },
  });

  if (!room) return c.json({ error: 'Room not found' }, 404);

  return c.json(room, 200);
};

export const createRoomHandler: RouteHandler<typeof createRoomRoute, Env> = async (c) => {
  const { isPrivate, name, password } = c.req.valid('json');

  const passwordHash = isPrivate && password ? await hashPassword(password) : null;

  const room = await prisma.room.create({
    data: { name, isPrivate, passwordHash },
    select: { id: true, name: true, isPrivate: true },
  });

  return c.json(room, 201);
};
