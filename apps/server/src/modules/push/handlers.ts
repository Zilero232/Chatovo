import { StatusCodes } from 'http-status-codes';
import { registerPushDevice, unregisterPushDevice } from './push.service';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { registerPushDeviceRoute, unregisterPushDeviceRoute } from './routes';

export const registerPushDeviceHandler: RouteHandler<typeof registerPushDeviceRoute, Env> = async (
  c,
) => {
  const { token, platform } = c.req.valid('json');

  await registerPushDevice(c.get('userId'), { token, platform });

  return c.body(null, StatusCodes.NO_CONTENT);
};

export const unregisterPushDeviceHandler: RouteHandler<
  typeof unregisterPushDeviceRoute,
  Env
> = async (c) => {
  const { token } = c.req.valid('json');

  await unregisterPushDevice(c.get('userId'), { token });

  return c.body(null, StatusCodes.NO_CONTENT);
};
