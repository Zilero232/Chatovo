import type { ChatMessage, ChatMessagesPage } from '@chatovo/schemas';

import { hasPermission, parseMentions } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { isNonNullish, isNullish } from 'remeda';

import type {
  DeleteChatMessageInput,
  EditChatMessageInput,
  GetOwnMessageInput,
  ListChatMessagesInput,
  ListPinnedMessagesInput,
  ModerateMessageInput,
  PinChatMessageInput,
  ReactChatMessageInput,
  SendChatMessageInput
} from './chat-message.service.types';

import { AppForbiddenException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { assertCanAccessRoom, resolveChannelPermissions } from '../../../../lib';
import { ReadStateService } from '../../../channels';
import { emitChatEvent } from '../../emit-chat-event';
import { assertCanPost } from '../../lib';
import { groupReactions, messageInclude, toChatMessage } from '../../mappers';

@Injectable()
export class ChatMessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly readState: ReadStateService
  ) {}

  private async assertThreadBelongsToChannel({
    roomId,
    threadId
  }: {
    roomId: string;
    threadId: string | null;
  }) {
    if (isNullish(threadId)) {
      return;
    }

    const thread = await this.prisma.thread.findFirst({
      where: { id: threadId, channelId: roomId },
      select: { id: true }
    });

    if (isNullish(thread)) {
      throw new AppNotFoundException('THREAD_NOT_FOUND', 'Thread not found');
    }
  }

  private async assertReplyBelongsToChannel({
    roomId,
    threadId,
    replyToId
  }: {
    roomId: string;
    threadId: string | null;
    replyToId: string | null;
  }) {
    if (isNullish(replyToId)) {
      return;
    }

    const target = await this.prisma.message.findFirst({
      where: { id: replyToId, roomId, threadId },
      select: { id: true }
    });

    if (isNullish(target)) {
      throw new AppNotFoundException('MESSAGE_NOT_FOUND', 'Message not found');
    }
  }

  async sendMessage({ input, senderId }: SendChatMessageInput): Promise<ChatMessage> {
    const { id, roomId, body } = input;
    const threadId = input.threadId ?? null;
    const replyToId = input.replyToId ?? null;

    const channel = await assertCanPost({ roomId, threadId, userId: senderId });

    await this.assertThreadBelongsToChannel({ roomId, threadId });
    await this.assertReplyBelongsToChannel({ roomId, threadId, replyToId });

    const existing = await this.prisma.message.findUnique({
      where: { id },
      include: messageInclude
    });

    if (isNonNullish(existing)) {
      if (existing.senderId !== senderId || existing.roomId !== roomId) {
        throw new AppForbiddenException('MESSAGE_NOT_OWNED', 'Message id already used');
      }

      return toChatMessage(existing);
    }

    const message = await this.prisma.message.create({
      data: { id, roomId, threadId, replyToId, senderId, body },
      include: messageInclude
    });

    if (isNonNullish(threadId)) {
      await this.prisma.thread.update({
        where: { id: threadId },
        data: { messageCount: { increment: 1 }, lastMessageAt: message.createdAt }
      });
    }

    const chatMessage = toChatMessage(message);

    await emitChatEvent(roomId, { type: 'chat.message', message: chatMessage });

    if (isNonNullish(channel)) {
      await this.recordMentions({
        serverId: channel.serverId,
        channelId: roomId,
        senderId,
        body,
        canMentionEveryone: hasPermission(channel.permissions, 'mentionEveryone'),
        at: message.createdAt
      });
    }

    return chatMessage;
  }

  private async recordMentions({
    serverId,
    channelId,
    senderId,
    body,
    canMentionEveryone,
    at
  }: {
    serverId: string;
    channelId: string;
    senderId: string;
    body: string;
    canMentionEveryone: boolean;
    at: Date;
  }) {
    const { userIds, roleIds, everyone } = parseMentions(body);

    if (userIds.length === 0 && roleIds.length === 0 && !(everyone && canMentionEveryone)) {
      return;
    }

    const members = await this.prisma.serverMember.findMany({
      where:
        everyone && canMentionEveryone
          ? { serverId }
          : {
              serverId,
              OR: [{ userId: { in: userIds } }, { roles: { some: { roleId: { in: roleIds } } } }]
            },
      select: { userId: true }
    });

    const targets = members.map(({ userId }) => userId).filter((userId) => userId !== senderId);

    await this.readState.recordMentions({ channelId, userIds: targets, at });
  }

  async listMessages({ query, userId }: ListChatMessagesInput): Promise<ChatMessagesPage> {
    const { roomId, threadId, cursor, limit } = query;

    await assertCanAccessRoom({ roomId, userId });

    const rows = await this.prisma.message.findMany({
      where: { roomId, threadId: threadId ?? null },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: messageInclude,
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

    await assertCanAccessRoom({ roomId: message.roomId, userId: senderId });

    return message;
  }

  async editMessage({ messageId, input, senderId }: EditChatMessageInput): Promise<ChatMessage> {
    await this.getOwnMessageOrThrow({ messageId, senderId });

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { body: input.body, editedAt: new Date() },
      include: messageInclude
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(chatMessage.roomId, {
      type: 'chat.edit',
      threadId: chatMessage.threadId,
      id: chatMessage.id,
      body: chatMessage.body,
      editedAt: chatMessage.editedAt ?? new Date().toISOString()
    });

    return chatMessage;
  }

  /** Deleting someone else's message needs `manageMessages` on that channel. */
  private async assertCanDeleteMessage({ messageId, userId }: ModerateMessageInput) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { senderId: true, deletedAt: true }
    });

    if (isNullish(message) || isNonNullish(message.deletedAt)) {
      throw new AppNotFoundException('MESSAGE_NOT_FOUND', 'Message not found');
    }

    if (message.senderId === userId) {
      await this.getOwnMessageOrThrow({ messageId, senderId: userId });

      return;
    }

    await this.assertCanModerateMessage({ messageId, userId });
  }

  private async assertCanModerateMessage({ messageId, userId }: ModerateMessageInput) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, roomId: true, deletedAt: true, room: { select: { serverId: true } } }
    });

    if (isNullish(message) || isNonNullish(message.deletedAt)) {
      throw new AppNotFoundException('MESSAGE_NOT_FOUND', 'Message not found');
    }

    if (isNullish(message.room.serverId)) {
      throw new AppForbiddenException('MESSAGE_NOT_OWNED', 'Not your message');
    }

    const permissions = await resolveChannelPermissions({
      serverId: message.room.serverId,
      userId,
      channelId: message.roomId
    });

    if (!hasPermission(permissions, 'manageMessages')) {
      throw new AppForbiddenException('PERMISSION_DENIED', 'Cannot manage messages here');
    }

    return message;
  }

  async pinMessage({ messageId, pinned, userId }: PinChatMessageInput): Promise<ChatMessage> {
    await this.assertCanModerateMessage({ messageId, userId });

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { pinned },
      include: messageInclude
    });

    return toChatMessage(message);
  }

  async listPinnedMessages({ roomId, userId }: ListPinnedMessagesInput): Promise<ChatMessage[]> {
    await assertCanAccessRoom({ roomId, userId });

    const rows = await this.prisma.message.findMany({
      where: { roomId, pinned: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: messageInclude
    });

    return rows.map(toChatMessage);
  }

  private async loadReactableOrThrow({ messageId, userId }: ModerateMessageInput) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, roomId: true, threadId: true, deletedAt: true }
    });

    if (isNullish(message) || isNonNullish(message.deletedAt)) {
      throw new AppNotFoundException('MESSAGE_NOT_FOUND', 'Message not found');
    }

    await assertCanAccessRoom({ roomId: message.roomId, userId });

    return message;
  }

  private async broadcastReactions(message: {
    id: string;
    roomId: string;
    threadId: string | null;
  }) {
    const rows = await this.prisma.messageReaction.findMany({
      where: { messageId: message.id },
      select: { emoji: true, userId: true }
    });

    const reactions = groupReactions(rows);

    await emitChatEvent(message.roomId, {
      type: 'chat.reaction',
      threadId: message.threadId,
      id: message.id,
      reactions
    });

    return reactions;
  }

  async addReaction({ messageId, emoji, userId }: ReactChatMessageInput) {
    const message = await this.loadReactableOrThrow({ messageId, userId });

    await this.prisma.messageReaction.upsert({
      where: { messageId_userId_emoji: { messageId, userId, emoji } },
      create: { messageId, userId, emoji },
      update: {}
    });

    return this.broadcastReactions(message);
  }

  async removeReaction({ messageId, emoji, userId }: ReactChatMessageInput) {
    const message = await this.loadReactableOrThrow({ messageId, userId });

    await this.prisma.messageReaction.deleteMany({ where: { messageId, userId, emoji } });

    return this.broadcastReactions(message);
  }

  async deleteMessage({ messageId, senderId }: DeleteChatMessageInput): Promise<ChatMessage> {
    await this.assertCanDeleteMessage({ messageId, userId: senderId });

    const message = await this.prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
      include: messageInclude
    });

    const chatMessage = toChatMessage(message);

    await emitChatEvent(chatMessage.roomId, {
      type: 'chat.delete',
      threadId: chatMessage.threadId,
      id: chatMessage.id,
      deletedAt: chatMessage.deletedAt ?? new Date().toISOString()
    });

    return chatMessage;
  }
}
