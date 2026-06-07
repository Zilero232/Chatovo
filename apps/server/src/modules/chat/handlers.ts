import { StatusCodes } from 'http-status-codes';
import {
  deleteMessage,
  editMessage,
  listMessages,
  sendMessage,
  uploadAttachment,
} from './chat.service';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type {
  deleteMessageRoute,
  editMessageRoute,
  listMessagesRoute,
  sendMessageRoute,
  uploadAttachmentRoute,
} from './routes';

export const uploadAttachmentHandler: RouteHandler<typeof uploadAttachmentRoute, Env> = async (
  c,
) => {
  const { roomId, file } = c.req.valid('form');

  return c.json(await uploadAttachment(roomId, file), StatusCodes.OK);
};

export const sendMessageHandler: RouteHandler<typeof sendMessageRoute, Env> = async (c) => {
  const message = await sendMessage(c.req.valid('json'), c.get('userId'));

  return c.json(message, StatusCodes.OK);
};

export const listMessagesHandler: RouteHandler<typeof listMessagesRoute, Env> = async (c) => {
  return c.json(await listMessages(c.req.valid('query')), StatusCodes.OK);
};

export const editMessageHandler: RouteHandler<typeof editMessageRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');
  const message = await editMessage(id, c.req.valid('json'), c.get('userId'));

  return c.json(message, StatusCodes.OK);
};

export const deleteMessageHandler: RouteHandler<typeof deleteMessageRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');
  const message = await deleteMessage(id, c.get('userId'));

  return c.json(message, StatusCodes.OK);
};
