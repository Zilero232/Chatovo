import {
  roomParticipantsResponseSchema,
  tokenRequestSchema,
  tokenResponseSchema,
} from '@chatovo/schemas/livekit';
import { createRoute, z } from '@hono/zod-openapi';

import { errorSchema } from '../shared/schemas';

const roomIdParamSchema = z.object({
  roomId: z.uuid().openapi({ param: { name: 'roomId', in: 'path' } }),
});

export const tokenRoute = createRoute({
  method: 'post',
  path: '/token',
  tags: ['livekit'],
  summary: 'Issue LiveKit access token',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: tokenRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Access token',
      content: { 'application/json': { schema: tokenResponseSchema } },
    },
    401: {
      description: 'Password required',
      content: { 'application/json': { schema: errorSchema } },
    },
    403: {
      description: 'Invalid password',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Room not found',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Server error',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const roomParticipantsRoute = createRoute({
  method: 'get',
  path: '/rooms/{roomId}/participants',
  tags: ['livekit'],
  summary: 'List participants currently connected to a LiveKit room',
  security: [{ bearerAuth: [] }],
  request: { params: roomIdParamSchema },
  responses: {
    200: {
      description: 'Participants list',
      content: { 'application/json': { schema: roomParticipantsResponseSchema } },
    },
    500: {
      description: 'Server error',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});
