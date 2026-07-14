import { registerPushDeviceInputSchema, unregisterPushDeviceInputSchema } from '@chatovo/schemas';
import { createRoute } from '@hono/zod-openapi';

import { errorSchema } from '../../shared/schemas';

export const registerPushDeviceRoute = createRoute({
  method: 'post',
  path: '/devices',
  tags: ['push'],
  summary: 'Register an FCM device token',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: registerPushDeviceInputSchema } },
    },
  },
  responses: {
    204: { description: 'Registered' },
    400: {
      description: 'Invalid input',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const unregisterPushDeviceRoute = createRoute({
  method: 'delete',
  path: '/devices',
  tags: ['push'],
  summary: 'Unregister an FCM device token',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: unregisterPushDeviceInputSchema } },
    },
  },
  responses: {
    204: { description: 'Unregistered' },
    400: {
      description: 'Invalid input',
      content: { 'application/json': { schema: errorSchema } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});
