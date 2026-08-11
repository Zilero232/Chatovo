import type { ChatMessage, ChatMessagesPage } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { isNonNullish } from 'remeda';

import type {
  DeleteChatMessageInput,
  EditChatMessageInput,
  GetOwnMessageInput,
  ListChatMessagesInput,
  SendChatMessageInput
} from './chat-message.service.types';

import { AppForbiddenException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { assertCanAccessDmRoom, assertRoomExists, senderSelect } from '../../../../lib';
import { emitChatEvent } from '../../emit-chat-event';
import { toChatMessage } from '../../mappers';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage({ input, senderId }: SendChatMessageInput): Promise<ChatMessage> {
    const { id, roomId, body } = input;

    await assertRoomExists(roomId);
    await assertCanAccessDmRoom({ roomId, userId: senderId });

    const existing = await this.prisma.message.findUnique({
      where: { id },
      include: { sender: senderSelect }
    });

    if (isNonNullish(existing)) {
      if (existing.senderId !== senderId || existing.roomId !== roomId) {
        throw new AppForbiddenException('MESSAGE_NOT_OWNED', 'Message id already used');
      }

      return toChatMessage(existing);
    }

    const message = await this.prisma.message.create({
      data: { id, roomId, senderId, body },
      include: { sender: senderSelect }
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(roomId, { type: 'chat.message', message: chatMessage });

    return chatMessage;
  }

  async listMessages({ query, userId }: ListChatMessagesInput): Promise<ChatMessagesPage> {
    const { roomId, cursor, limit } = query;

    await assertRoomExists(roomId);
    await assertCanAccessDmRoom({ roomId, userId });

    const rows = await this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: { sender: senderSelect },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const oldest = page.at(-1)?.id ?? null;

    return {
      items: page.slice().reverse().map(toChatMessage),
      nextCursor: hasMore ? oldest : null
    };
  }

  private async getOwnMessageOrThrow({ messageId, senderId }: GetOwnMessageInput) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, senderId: true, roomId: true, deletedAt: true }
    });

    if (!message || message.deletedAt) {
      throw new AppNotFoundException('MESSAGE_NOT_FOUND', 'Message not found');
    }

    if (message.senderId !== senderId) {
      throw new AppForbiddenException('MESSAGE_NOT_OWNED', 'Not your message');
    }

    await assertCanAccessDmRoom({ roomId: message.roomId, userId: senderId });

    return message;
  }

  async editMessage({ messageId, input, senderId }: EditChatMessageInput): Promise<ChatMessage> {
    await this.getOwnMessageOrThrow({ messageId, senderId });

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { body: input.body, editedAt: new Date() },
      include: { sender: senderSelect }
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(chatMessage.roomId, {
      type: 'chat.edit',
      id: chatMessage.id,
      body: chatMessage.body,
      editedAt: chatMessage.editedAt ?? new Date().toISOString()
    });

    return chatMessage;
  }

  async deleteMessage({ messageId, senderId }: DeleteChatMessageInput): Promise<ChatMessage> {
    await this.getOwnMessageOrThrow({ messageId, senderId });

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
      include: { sender: senderSelect }
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(chatMessage.roomId, {
      type: 'chat.delete',
      id: chatMessage.id,
      deletedAt: chatMessage.deletedAt ?? new Date().toISOString()
    });

    return chatMessage;
  }
}
