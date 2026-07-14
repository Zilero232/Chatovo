import { OpenAPIHono } from '@hono/zod-openapi';

import { registerPushDeviceHandler, unregisterPushDeviceHandler } from './handlers';
import { registerPushDeviceRoute, unregisterPushDeviceRoute } from './routes';

import type { Env } from '../../shared/types';

export const pushRouter = new OpenAPIHono<Env>()
  .openapi(registerPushDeviceRoute, registerPushDeviceHandler)
  .openapi(unregisterPushDeviceRoute, unregisterPushDeviceHandler);
