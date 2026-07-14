import {
  friendListSchema,
  friendRequestListSchema,
  friendshipRelationSchema,
  friendUserSchema,
  incomingFriendCallResponseSchema,
  incomingFriendCallSchema,
  outgoingFriendCallResponseSchema,
  roomSchema,
  sendFriendRequestInputSchema,
} from '@chatovo/schemas';
import { createRoute, z } from '@hono/zod-openapi';

import { errorSchema } from '../../shared/schemas';

const userIdParamSchema = z.object({
  userId: z.string().openapi({ param: { name: 'userId', in: 'path' } }),
});

const friendshipIdParamSchema = z.object({
  id: z.string().openapi({ param: { name: 'id', in: 'path' } }),
});

const friendTagParamSchema = z.object({
  tag: z.string().openapi({ param: { name: 'tag', in: 'path' } }),
});

export const listFriendsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['friends'],
  summary: 'List accepted friends',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Friends list',
      content: { 'application/json': { schema: friendListSchema } },
    },
  },
});

export const listIncomingRequestsRoute = createRoute({
  method: 'get',
  path: '/requests/incoming',
  tags: ['friends'],
  summary: 'List incoming friend requests',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Incoming requests',
      content: { 'application/json': { schema: friendRequestListSchema } },
    },
  },
});

export const getFriendshipRelationRoute = createRoute({
  method: 'get',
  path: '/relations/{userId}',
  tags: ['friends'],
  summary: 'Get friendship relation with a user',
  security: [{ bearerAuth: [] }],
  request: { params: userIdParamSchema },
  responses: {
    200: {
      description: 'Relation status',
      content: { 'application/json': { schema: friendshipRelationSchema } },
    },
  },
});

export const sendFriendRequestRoute = createRoute({
  method: 'post',
  path: '/requests',
  tags: ['friends'],
  summary: 'Send a friend request by tag',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: sendFriendRequestInputSchema } },
    },
  },
  responses: {
    200: {
      description: 'Updated relation',
      content: { 'application/json': { schema: friendshipRelationSchema } },
    },
    400: {
      description: 'Invalid input',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorSchema } },
    },
    409: {
      description: 'Conflict',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const findUserByTagRoute = createRoute({
  method: 'get',
  path: '/lookup/{tag}',
  tags: ['friends'],
  summary: 'Find user by friend tag',
  security: [{ bearerAuth: [] }],
  request: { params: friendTagParamSchema },
  responses: {
    200: {
      description: 'Found user',
      content: { 'application/json': { schema: friendUserSchema } },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const acceptFriendRequestRoute = createRoute({
  method: 'post',
  path: '/requests/{id}/accept',
  tags: ['friends'],
  summary: 'Accept a friend request',
  security: [{ bearerAuth: [] }],
  request: { params: friendshipIdParamSchema },
  responses: {
    200: {
      description: 'Accepted',
      content: { 'application/json': { schema: friendshipRelationSchema } },
    },
    404: {
      description: 'Request not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const declineFriendRequestRoute = createRoute({
  method: 'post',
  path: '/requests/{id}/decline',
  tags: ['friends'],
  summary: 'Decline a friend request',
  security: [{ bearerAuth: [] }],
  request: { params: friendshipIdParamSchema },
  responses: {
    204: { description: 'Declined' },
    404: {
      description: 'Request not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const removeFriendshipRoute = createRoute({
  method: 'delete',
  path: '/{userId}',
  tags: ['friends'],
  summary: 'Remove a friend or cancel an outgoing request',
  security: [{ bearerAuth: [] }],
  request: { params: userIdParamSchema },
  responses: {
    204: { description: 'Removed' },
    403: {
      description: 'Forbidden',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const getOrCreateDmRoomRoute = createRoute({
  method: 'post',
  path: '/{userId}/dm-room',
  tags: ['friends'],
  summary: 'Get or create personal DM room with a friend',
  security: [{ bearerAuth: [] }],
  request: { params: userIdParamSchema },
  responses: {
    200: {
      description: 'DM room',
      content: { 'application/json': { schema: roomSchema } },
    },
    403: {
      description: 'Only accepted friends can open DM',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const ringFriendCallRoute = createRoute({
  method: 'post',
  path: '/{userId}/call',
  tags: ['friends'],
  summary: 'Ring a friend for a voice call in their DM room',
  security: [{ bearerAuth: [] }],
  request: { params: userIdParamSchema },
  responses: {
    200: {
      description: 'DM room used for the call',
      content: { 'application/json': { schema: roomSchema } },
    },
    403: {
      description: 'Only accepted friends can call',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const getIncomingFriendCallRoute = createRoute({
  method: 'get',
  path: '/calls/incoming',
  tags: ['friends'],
  summary: 'Poll for an incoming friend call',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Incoming call if any',
      content: { 'application/json': { schema: incomingFriendCallResponseSchema } },
    },
  },
});

export const acceptIncomingFriendCallRoute = createRoute({
  method: 'post',
  path: '/calls/accept',
  tags: ['friends'],
  summary: 'Accept an incoming friend call',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Accepted call',
      content: { 'application/json': { schema: incomingFriendCallSchema.nullable() } },
    },
  },
});

export const declineIncomingFriendCallRoute = createRoute({
  method: 'post',
  path: '/calls/decline',
  tags: ['friends'],
  summary: 'Decline an incoming friend call',
  security: [{ bearerAuth: [] }],
  responses: {
    204: { description: 'Declined' },
  },
});

export const cancelOutgoingFriendCallRoute = createRoute({
  method: 'post',
  path: '/calls/cancel',
  tags: ['friends'],
  summary: 'Cancel an outgoing friend call',
  security: [{ bearerAuth: [] }],
  responses: {
    204: { description: 'Cancelled' },
  },
});

export const getOutgoingFriendCallRoute = createRoute({
  method: 'get',
  path: '/calls/outgoing',
  tags: ['friends'],
  summary: 'Poll outgoing friend call status',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Outgoing call if any',
      content: { 'application/json': { schema: outgoingFriendCallResponseSchema } },
    },
  },
});

export const ackOutgoingFriendCallRoute = createRoute({
  method: 'post',
  path: '/calls/ack',
  tags: ['friends'],
  summary: 'Clear outgoing call after joining',
  security: [{ bearerAuth: [] }],
  responses: {
    204: { description: 'Acknowledged' },
  },
});
