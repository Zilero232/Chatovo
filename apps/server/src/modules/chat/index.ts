import { OpenAPIHono } from '@hono/zod-openapi';
import {
  deleteMessageHandler,
  editMessageHandler,
  listMessagesHandler,
  sendMessageHandler,
  uploadAttachmentHandler,
} from './handlers';
import {
  deleteMessageRoute,
  editMessageRoute,
  listMessagesRoute,
  sendMessageRoute,
  uploadAttachmentRoute,
} from './routes';
import type { Env } from '../../shared/types';

export const chatRouter = new OpenAPIHono<Env>()
  .openapi(uploadAttachmentRoute, uploadAttachmentHandler)
  .openapi(sendMessageRoute, sendMessageHandler)
  .openapi(listMessagesRoute, listMessagesHandler)
  .openapi(editMessageRoute, editMessageHandler)
  .openapi(deleteMessageRoute, deleteMessageHandler);
