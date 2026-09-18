import { Injectable } from '@nestjs/common';
import { isEmpty, isNonNullish, isNullish } from 'remeda';

import type {
  CreateThreadInput,
  CreateThreadTagInput,
  DeleteThreadInput,
  DeleteThreadTagInput,
  ListThreadsInput,
  ListThreadTagsInput,
  UpdateThreadInput
} from './threads.service.types';

import { ChannelType } from '../../../../../generated';
import {
  AppBadRequestException,
  AppConflictException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { assertChannelPermission, threadSelect, threadTagSelect } from '../../../../lib';
import { emitRoomEvent } from '../../../realtime';
import { mapThread, mapThreadTag } from '../../lib';

const THREADED_CHANNEL_TYPES: ChannelType[] = [ChannelType.text, ChannelType.forum];

@Injectable()
export class ThreadsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertTagsBelongToChannel({
    channelId,
    tagIds
  }: {
    channelId: string;
    tagIds: string[];
  }) {
    if (isEmpty(tagIds)) {
      return;
    }

    const found = await this.prisma.threadTag.count({
      where: { id: { in: tagIds }, channelId }
    });

    if (found !== tagIds.length) {
      throw new AppNotFoundException('THREAD_TAG_NOT_FOUND', 'Thread tag not found');
    }
  }

  private assertThreadableChannel(type: ChannelType) {
    if (!THREADED_CHANNEL_TYPES.includes(type)) {
      throw new AppBadRequestException(
        'CHANNEL_TYPE_MISMATCH',
        'This channel type does not support threads'
      );
    }
  }

  async listThreads({ channelId, userId, includeArchived }: ListThreadsInput) {
    const { channel } = await assertChannelPermission({
      channelId,
      userId,
      permission: 'readMessageHistory'
    });

    this.assertThreadableChannel(channel.type);

    const threads = await this.prisma.thread.findMany({
      where: { channelId, archivedAt: includeArchived ? undefined : null },
      orderBy: [{ pinned: 'desc' }, { lastMessageAt: 'desc' }],
      select: threadSelect
    });

    return threads.map(mapThread);
  }

  async createThread({ channelId, input, userId }: CreateThreadInput) {
    const { channel } = await assertChannelPermission({
      channelId,
      userId,
      permission: 'createThreads'
    });

    this.assertThreadableChannel(channel.type);

    if (isNonNullish(channel.archivedAt)) {
      throw new AppBadRequestException('CHANNEL_ARCHIVED', 'This channel is archived');
    }

    await this.assertTagsBelongToChannel({ channelId, tagIds: input.tagIds ?? [] });

    const created = await this.prisma.$transaction(async (tx) => {
      const thread = await tx.thread.create({
        data: { channelId, name: input.name, creatorId: userId },
        select: { id: true }
      });

      if (isNonNullish(input.tagIds) && input.tagIds.length > 0) {
        await tx.threadTagLink.createMany({
          data: input.tagIds.map((tagId) => ({ threadId: thread.id, tagId })),
          skipDuplicates: true
        });
      }

      if (isNonNullish(input.firstMessage) && input.firstMessage.length > 0) {
        await tx.message.create({
          data: {
            roomId: channelId,
            threadId: thread.id,
            senderId: userId,
            body: input.firstMessage
          }
        });

        await tx.thread.update({
          where: { id: thread.id },
          data: { messageCount: 1, lastMessageAt: new Date() }
        });
      }

      return tx.thread.findUniqueOrThrow({ where: { id: thread.id }, select: threadSelect });
    });

    const thread = mapThread(created);

    emitRoomEvent(channelId, { type: 'thread.upsert', channelId, thread });

    return thread;
  }

  private async loadThreadOrThrow(threadId: string) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId },
      select: { id: true, channelId: true, creatorId: true, locked: true }
    });

    if (isNullish(thread)) {
      throw new AppNotFoundException('THREAD_NOT_FOUND', 'Thread not found');
    }

    return thread;
  }

  async updateThread({ threadId, input, userId }: UpdateThreadInput) {
    const current = await this.loadThreadOrThrow(threadId);
    const isCreator = current.creatorId === userId;

    await assertChannelPermission({
      channelId: current.channelId,
      userId,
      permission: isCreator ? 'createThreads' : 'manageThreads'
    });

    if (current.locked && !isCreator) {
      throw new AppBadRequestException('THREAD_LOCKED', 'This thread is locked');
    }

    await this.assertTagsBelongToChannel({
      channelId: current.channelId,
      tagIds: input.tagIds ?? []
    });

    const updated = await this.prisma.$transaction(async (tx) => {
      if (isNonNullish(input.tagIds)) {
        await tx.threadTagLink.deleteMany({ where: { threadId } });
        await tx.threadTagLink.createMany({
          data: input.tagIds.map((tagId) => ({ threadId, tagId })),
          skipDuplicates: true
        });
      }

      return tx.thread.update({
        where: { id: threadId },
        data: {
          name: input.name,
          pinned: input.pinned,
          locked: input.locked,
          archivedAt: isNullish(input.archived) ? undefined : input.archived ? new Date() : null
        },
        select: threadSelect
      });
    });

    const thread = mapThread(updated);

    emitRoomEvent(current.channelId, {
      type: 'thread.upsert',
      channelId: current.channelId,
      thread
    });

    return thread;
  }

  async deleteThread({ threadId, userId }: DeleteThreadInput) {
    const thread = await this.loadThreadOrThrow(threadId);

    await assertChannelPermission({
      channelId: thread.channelId,
      userId,
      permission: thread.creatorId === userId ? 'createThreads' : 'manageThreads'
    });

    await this.prisma.thread.delete({ where: { id: threadId } });

    emitRoomEvent(thread.channelId, {
      type: 'thread.delete',
      channelId: thread.channelId,
      threadId
    });
  }

  async listThreadTags({ channelId, userId }: ListThreadTagsInput) {
    await assertChannelPermission({ channelId, userId, permission: 'viewChannel' });

    const tags = await this.prisma.threadTag.findMany({
      where: { channelId },
      orderBy: { name: 'asc' },
      select: threadTagSelect
    });

    return tags.map(mapThreadTag);
  }

  async createThreadTag({ channelId, input, userId }: CreateThreadTagInput) {
    const { channel } = await assertChannelPermission({
      channelId,
      userId,
      permission: 'manageChannels'
    });

    this.assertThreadableChannel(channel.type);

    const existing = await this.prisma.threadTag.findUnique({
      where: { channelId_name: { channelId, name: input.name } },
      select: { id: true }
    });

    if (isNonNullish(existing)) {
      throw new AppConflictException(
        'THREAD_TAG_NAME_TAKEN',
        'A tag with this name already exists'
      );
    }

    const created = await this.prisma.threadTag.create({
      data: { channelId, name: input.name, emoji: input.emoji ?? null },
      select: threadTagSelect
    });

    return mapThreadTag(created);
  }

  async deleteThreadTag({ tagId, userId }: DeleteThreadTagInput) {
    const tag = await this.prisma.threadTag.findUnique({
      where: { id: tagId },
      select: { channelId: true }
    });

    if (isNullish(tag)) {
      throw new AppNotFoundException('THREAD_TAG_NOT_FOUND', 'Tag not found');
    }

    await assertChannelPermission({
      channelId: tag.channelId,
      userId,
      permission: 'manageChannels'
    });

    await this.prisma.threadTag.delete({ where: { id: tagId } });
  }
}
