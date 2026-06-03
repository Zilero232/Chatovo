import { StatusCodes } from 'http-status-codes';
import { issueRoomToken } from '../livekit.service';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../../shared/types';
import type { tokenRoute } from '../routes';

export const tokenHandler: RouteHandler<typeof tokenRoute, Env> = async (c) => {
  const { roomId, password } = c.req.valid('json');

  const payload = await issueRoomToken({
    roomId,
    password,
    userId: c.get('userId'),
    email: c.get('email') ?? null,
    isAdmin: c.get('role') === 'admin',
  });

  return c.json(payload, StatusCodes.OK);
};
