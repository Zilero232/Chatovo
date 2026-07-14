import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { extension } from 'mime-types';

import { ATTACHMENT_MAX_BYTES } from '../../config/uploads';
import { PrismaService } from '../../core';
import { assertCanAccessDmRoom, assertRoomExists, senderSelect } from '../../lib';
import { saveUpload } from '../uploads';
import { emitChatEvent } from './emit-chat-event';
import { toChatMessage } from './mappers';

import type {
  ChatAttachment,
  ChatMessage,
  ChatMessagesPage,
  EditMessageInput,
  ListMessagesQuery,
  SendMessageInput,
} from '@chatovo/schemas';

type UploadedAttachment = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadAttachment(
    roomId: string,
    file: UploadedAttachment,
    userId: string,
  ): Promise<ChatAttachment> {
    const { size, mimetype: type, originalname: name } = file;

    if (size === 0) {
      throw new BadRequestException('Empty file');
    }
    if (size > ATTACHMENT_MAX_BYTES) {
      throw new BadRequestException('File too large');
    }

    await assertRoomExists(roomId);
    await assertCanAccessDmRoom(roomId, userId);

    const ext = extension(type) || 'bin';
    const key = `chat-attachments/${roomId}/${crypto.randomUUID()}.${ext}`;
    const buffer = new ArrayBuffer(file.buffer.byteLength);
    new Uint8Array(buffer).set(file.buffer);

    const url = await saveUpload(key, buffer);

    return { kind: 'attachment', url, name, size, mime: type };
  }

  async sendMessage(input: SendMessageInput, senderId: string): Promise<ChatMessage> {
    const { id, roomId, body } = input;

    await assertRoomExists(roomId);
    await assertCanAccessDmRoom(roomId, senderId);

    const message = await this.prisma.message.upsert({
      where: { id },
      create: { id, roomId, senderId, body },
      update: {},
      include: { sender: senderSelect },
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(roomId, { type: 'chat.message', message: chatMessage });

    return chatMessage;
  }

  async listMessages(query: ListMessagesQuery, userId: string): Promise<ChatMessagesPage> {
    const { roomId, cursor, limit } = query;

    await assertRoomExists(roomId);
    await assertCanAccessDmRoom(roomId, userId);

    const rows = await this.prisma.message.findMany({
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
  }

  private async getOwnMessageOrThrow(messageId: string, senderId: string) {
    const message = await this.prisma.message.findUnique({ where: { id: messageId } });

    if (!message || message.deletedAt) {
      throw new NotFoundException('Message not found');
    }
    if (message.senderId !== senderId) {
      throw new ForbiddenException('Not your message');
    }

    await assertCanAccessDmRoom(message.roomId, senderId);

    return message;
  }

  async editMessage(
    messageId: string,
    input: EditMessageInput,
    senderId: string,
  ): Promise<ChatMessage> {
    await this.getOwnMessageOrThrow(messageId, senderId);

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { body: input.body, editedAt: new Date() },
      include: { sender: senderSelect },
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(chatMessage.roomId, {
      type: 'chat.edit',
      id: chatMessage.id,
      body: chatMessage.body,
      editedAt: chatMessage.editedAt ?? new Date().toISOString(),
    });

    return chatMessage;
  }

  async deleteMessage(messageId: string, senderId: string): Promise<ChatMessage> {
    await this.getOwnMessageOrThrow(messageId, senderId);

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
      include: { sender: senderSelect },
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(chatMessage.roomId, {
      type: 'chat.delete',
      id: chatMessage.id,
      deletedAt: chatMessage.deletedAt ?? new Date().toISOString(),
    });

    return chatMessage;
  }
}
