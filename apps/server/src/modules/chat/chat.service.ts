import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { extension } from 'mime-types';
import { ATTACHMENT_MAX_BYTES } from '../../config/uploads';
import { prisma } from '../../core';
import { assertRoomExists, senderSelect } from '../../lib';
import { saveUpload } from '../uploads';
import { toChatMessage } from './mappers';
import type {
  ChatAttachment,
  ChatMessage,
  ChatMessagesPage,
  EditMessageInput,
  ListMessagesQuery,
  SendMessageInput,
} from '@chatovo/schemas';

export const uploadAttachment = async (roomId: string, file: File): Promise<ChatAttachment> => {
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

  return { kind: 'attachment', url, name, size, mime: type };
};

export const sendMessage = async (
  input: SendMessageInput,
  senderId: string,
): Promise<ChatMessage> => {
  const { id, roomId, body } = input;

  await assertRoomExists(roomId);

  const message = await prisma.message.upsert({
    where: { id },
    create: { id, roomId, senderId, body },
    update: {},
    include: { sender: senderSelect },
  });

  return toChatMessage(message);
};

export const listMessages = async (query: ListMessagesQuery): Promise<ChatMessagesPage> => {
  const { roomId, cursor, limit } = query;

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

  return {
    items: page.reverse().map(toChatMessage),
    nextCursor: hasMore ? (page[0]?.id ?? null) : null,
  };
};

const getOwnMessageOrThrow = async (messageId: string, senderId: string) => {
  const message = await prisma.message.findUnique({ where: { id: messageId } });

  if (!message || message.deletedAt) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Message not found' });
  }
  if (message.senderId !== senderId) {
    throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Not your message' });
  }

  return message;
};

export const editMessage = async (
  messageId: string,
  input: EditMessageInput,
  senderId: string,
): Promise<ChatMessage> => {
  await getOwnMessageOrThrow(messageId, senderId);

  const message = await prisma.message.update({
    where: { id: messageId },
    data: { body: input.body, editedAt: new Date() },
    include: { sender: senderSelect },
  });

  return toChatMessage(message);
};

export const deleteMessage = async (messageId: string, senderId: string): Promise<ChatMessage> => {
  await getOwnMessageOrThrow(messageId, senderId);

  const message = await prisma.message.update({
    where: { id: messageId },
    data: { deletedAt: new Date() },
    include: { sender: senderSelect },
  });

  return toChatMessage(message);
};
