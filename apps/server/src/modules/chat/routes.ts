import {
  chatAttachmentSchema,
  chatMessageSchema,
  chatMessagesPageSchema,
  editMessageInputSchema,
  listMessagesQuerySchema,
  messageIdParamSchema,
  sendMessageInputSchema,
} from '@chatovo/schemas';
import { createRoute, z } from '@hono/zod-openapi';
import { errorSchema } from '../../shared/schemas';

const uploadAttachmentFormSchema = z.object({
  roomId: z.uuid(),
  file: z.instanceof(File),
});

export const uploadAttachmentRoute = createRoute({
  method: 'post',
  path: '/attachments',
  tags: ['chat'],
  summary: 'Upload a chat attachment',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'multipart/form-data': { schema: uploadAttachmentFormSchema } },
    },
  },
  responses: {
    200: {
      description: 'Uploaded attachment',
      content: { 'application/json': { schema: chatAttachmentSchema } },
    },
    400: {
      description: 'Invalid input',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Upload failed',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const sendMessageRoute = createRoute({
  method: 'post',
  path: '/messages',
  tags: ['chat'],
  summary: 'Persist a chat message',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: sendMessageInputSchema } },
    },
  },
  responses: {
    200: {
      description: 'Saved message',
      content: { 'application/json': { schema: chatMessageSchema } },
    },
    400: {
      description: 'Invalid input',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Room not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const listMessagesRoute = createRoute({
  method: 'get',
  path: '/messages',
  tags: ['chat'],
  summary: 'List chat messages for a room',
  security: [{ bearerAuth: [] }],
  request: { query: listMessagesQuerySchema },
  responses: {
    200: {
      description: 'Messages page',
      content: { 'application/json': { schema: chatMessagesPageSchema } },
    },
    404: {
      description: 'Room not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const editMessageRoute = createRoute({
  method: 'patch',
  path: '/messages/{id}',
  tags: ['chat'],
  summary: 'Edit own chat message',
  security: [{ bearerAuth: [] }],
  request: {
    params: messageIdParamSchema,
    body: {
      required: true,
      content: { 'application/json': { schema: editMessageInputSchema } },
    },
  },
  responses: {
    200: {
      description: 'Edited message',
      content: { 'application/json': { schema: chatMessageSchema } },
    },
    403: {
      description: 'Not your message',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Message not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const deleteMessageRoute = createRoute({
  method: 'delete',
  path: '/messages/{id}',
  tags: ['chat'],
  summary: 'Delete own chat message',
  security: [{ bearerAuth: [] }],
  request: { params: messageIdParamSchema },
  responses: {
    200: {
      description: 'Deleted message',
      content: { 'application/json': { schema: chatMessageSchema } },
    },
    403: {
      description: 'Not your message',
      content: { 'application/json': { schema: errorSchema } },
    },
    404: {
      description: 'Message not found',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});
