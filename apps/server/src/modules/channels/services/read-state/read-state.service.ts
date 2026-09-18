import { Injectable } from '@nestjs/common';
import { isNonNullish } from 'remeda';

import type {
  ListReadStatesInput,
  MarkChannelReadInput,
  MuteChannelInput,
  RecordMentionsInput
} from './read-state.service.types';

import { PrismaService } from '../../../../core';
import { assertChannelPermission, assertServerMember } from '../../../../lib';
import { emitUserEvent } from '../../../realtime';
import { mapReadState } from '../../lib';

const readStateSelect = {
  channelId: true,
  lastReadAt: true,
  mentionCount: true,
  mutedUntil: true
} as const;

@Injectable()
export class ReadStateService {
  constructor(private readonly prisma: PrismaService) {}

  async listReadStates({ serverId, userId }: ListReadStatesInput) {
    await assertServerMember({ serverId, userId });

    const [states, channels] = await Promise.all([
      this.prisma.channelRead.findMany({
        where: { userId, channel: { serverId } },
        select: readStateSelect
      }),
      this.prisma.room.findMany({
        where: { serverId },
        select: {
          id: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { createdAt: true }
          }
        }
      })
    ]);

    const lastMessageByChannel = new Map(
      channels.map((channel) => [channel.id, channel.messages.at(0)?.createdAt ?? null])
    );

    return states.map((state) =>
      mapReadState(state, lastMessageByChannel.get(state.channelId) ?? null)
    );
  }

  async markChannelRead({ channelId, input, userId }: MarkChannelReadInput) {
    await assertChannelPermission({ channelId, userId, permission: 'viewChannel' });

    const lastReadAt = isNonNullish(input.lastReadAt) ? new Date(input.lastReadAt) : new Date();

    const saved = await this.prisma.channelRead.upsert({
      where: { channelId_userId: { channelId, userId } },
      create: { channelId, userId, lastReadAt, mentionCount: 0 },
      update: { lastReadAt, mentionCount: 0 },
      select: readStateSelect
    });

    const state = mapReadState(saved, null);

    emitUserEvent(userId, { type: 'read.state', state });

    return state;
  }

  async recordMentions({ channelId, userIds, at }: RecordMentionsInput) {
    await Promise.all(
      userIds.map(async (userId) => {
        const saved = await this.prisma.channelRead.upsert({
          where: { channelId_userId: { channelId, userId } },
          create: { channelId, userId, lastReadAt: new Date(0), mentionCount: 1 },
          update: { mentionCount: { increment: 1 } },
          select: readStateSelect
        });

        emitUserEvent(userId, { type: 'read.state', state: mapReadState(saved, at) });
      })
    );
  }

  async muteChannel({ channelId, mutedUntil, userId }: MuteChannelInput) {
    await assertChannelPermission({ channelId, userId, permission: 'viewChannel' });

    const parsed = isNonNullish(mutedUntil) ? new Date(mutedUntil) : null;

    const saved = await this.prisma.channelRead.upsert({
      where: { channelId_userId: { channelId, userId } },
      create: { channelId, userId, mutedUntil: parsed },
      update: { mutedUntil: parsed },
      select: readStateSelect
    });

    const state = mapReadState(saved, null);

    emitUserEvent(userId, { type: 'read.state', state });

    return state;
  }
}
