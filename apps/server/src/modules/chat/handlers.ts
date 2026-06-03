import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { extension } from 'mime-types';
import { isNullish } from 'remeda';
import { ATTACHMENT_MAX_BYTES } from '../../config/uploads';
import { prisma } from '../../core';
import { saveUpload } from '../uploads';
import { senderSelect, toChatMessage } from './mappers';
import type { ChatAttachment } from '@chatovo/schemas';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { listMessagesRoute, sendMessageRoute, uploadAttachmentRoute } from './routes';

const assertRoomExists = async (roomId: string): Promise<void> => {
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { id: true } });

  if (isNullish(room)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Room not found' });
  }
};

export const uploadAttachmentHandler: RouteHandler<typeof uploadAttachmentRoute, Env> = async (
  c,
) => {
  const { roomId, file } = c.req.valid('form');
  const { size, type, name } = file;

  if (size === 0) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'Empty file' });
  }
  if (size > ATTACHMENT_MAX_BYTES) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'File too large' });
  }

  await assertRoomExists(roomId);

  const ext = extension(type) || 'bin';
  const key = `chat-attachments/${roomId}/${crypto.randomUUID()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const url = await saveUpload(key, buffer);

  const attachment: ChatAttachment = {
    kind: 'attachment',
    url,
    name,
    size,
    mime: type,
  };

  return c.json(attachment, StatusCodes.OK);
};

export const sendMessageHandler: RouteHandler<typeof sendMessageRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const { roomId, body } = c.req.valid('json');

  await assertRoomExists(roomId);

  const message = await prisma.message.create({
    data: { roomId, senderId: userId, body },
    include: { sender: senderSelect },
  });

  return c.json(toChatMessage(message), StatusCodes.OK);
};

export const listMessagesHandler: RouteHandler<typeof listMessagesRoute, Env> = async (c) => {
  const { roomId, cursor, limit } = c.req.valid('query');

  await assertRoomExists(roomId);

  const rows = await prisma.message.findMany({
    where: { roomId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    include: { sender: senderSelect },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;

  return c.json(
    {
      items: page.reverse().map(toChatMessage),
      nextCursor: hasMore ? (page[0]?.id ?? null) : null,
    },
    StatusCodes.OK,
  );
};
