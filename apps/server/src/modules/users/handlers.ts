import { StatusCodes } from 'http-status-codes';
import { getUserProfile, updateProfile } from './users.service';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { getUserProfileRoute, updateProfileRoute } from './routes';

export const getUserProfileHandler: RouteHandler<typeof getUserProfileRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');

  return c.json(await getUserProfile(id), StatusCodes.OK);
};

export const updateProfileHandler: RouteHandler<typeof updateProfileRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const profile = await updateProfile(userId, c.req.valid('form'));

  return c.json(profile, StatusCodes.OK);
};
