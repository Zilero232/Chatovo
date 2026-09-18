import { hasPermission, PERMISSIONS, serializePermissions } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { isEmpty, isNonNullish, isNullish } from 'remeda';

import type {
  CreateChannelInput,
  DeleteChannelInput,
  GetChannelInput,
  GetChannelTreeInput,
  ReorderChannelsInput,
  UpdateChannelInput
} from './channels.service.types';

import { ChannelType, OverwriteTarget } from '../../../../../generated';
import {
  AppConflictException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import {
  assertChannelPermission,
  assertServerPermission,
  categorySelect,
  channelSelect,
  resolveServerChannelPermissions
} from '../../../../lib';
import { closeLivekitRoom, revokeRoomGrants } from '../../../livekit';
import { emitServerEvent } from '../../../realtime';
import { mapCategory, mapChannel } from '../../lib';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The sidebar's single request: every category and channel the viewer may see,
   * plus their resolved permission mask per channel.
   */
  async getChannelTree({ serverId, userId }: GetChannelTreeInput) {
    const { context, channelPermissions } = await resolveServerChannelPermissions({
      serverId,
      userId
    });

    if (isNullish(context)) {
      throw new AppForbiddenException('PERMISSION_DENIED', 'Not a member of this server');
    }

    const [categories, channels] = await Promise.all([
      this.prisma.category.findMany({
        where: { serverId },
        orderBy: { position: 'asc' },
        select: categorySelect
      }),
      this.prisma.room.findMany({
        where: { serverId },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        select: channelSelect
      })
    ]);

    const visible = channels.filter((channel) =>
      hasPermission(channelPermissions.get(channel.id) ?? 0n, 'viewChannel')
    );

    const visibleCategoryIds = new Set(visible.map((channel) => channel.categoryId));

    return {
      serverId,
      categories: categories.filter(({ id }) => visibleCategoryIds.has(id)).map(mapCategory),
      channels: visible.map(mapChannel),
      permissions: serializePermissions(context.permissions),
      channelPermissions: Object.fromEntries(
        visible.map((channel) => [
          channel.id,
          serializePermissions(channelPermissions.get(channel.id) ?? 0n)
        ])
      )
    };
  }

  /** Every voice channel the viewer may see across their servers — used by friend activity. */
  async listVoiceChannels(userId: string) {
    const rooms = await this.prisma.room.findMany({
      where: { type: ChannelType.voice, server: { members: { some: { userId } } } },
      select: { id: true, name: true, serverId: true, server: { select: { name: true } } }
    });

    const serverIds = [...new Set(rooms.map((room) => room.serverId).filter(isNonNullish))];

    const visibility = await Promise.all(
      serverIds.map(async (serverId) => {
        const { channelPermissions } = await resolveServerChannelPermissions({ serverId, userId });

        return [serverId, channelPermissions] as const;
      })
    );

    const permissionsByServer = new Map(visibility);

    return rooms.flatMap((room) => {
      if (isNullish(room.serverId) || isNullish(room.server)) {
        return [];
      }

      const mask = permissionsByServer.get(room.serverId)?.get(room.id) ?? 0n;

      if (!hasPermission(mask, 'viewChannel')) {
        return [];
      }

      return [
        { id: room.id, name: room.name, serverId: room.serverId, serverName: room.server.name }
      ];
    });
  }

  async getChannel({ channelId, userId }: GetChannelInput) {
    const { channel } = await assertChannelPermission({
      channelId,
      userId,
      permission: 'viewChannel'
    });

    const row = await this.prisma.room.findUnique({
      where: { id: channel.id },
      select: channelSelect
    });

    if (isNullish(row)) {
      throw new AppNotFoundException('CHANNEL_NOT_FOUND', 'Channel not found');
    }

    return mapChannel(row);
  }

  private async assertChannelNameAvailable({
    serverId,
    type,
    name
  }: {
    serverId: string;
    type: ChannelType;
    name: string;
  }) {
    const existing = await this.prisma.room.findUnique({
      where: { serverId_type_name: { serverId, type, name } },
      select: { id: true }
    });

    if (isNonNullish(existing)) {
      throw new AppConflictException(
        'CHANNEL_NAME_TAKEN',
        'A channel with this name already exists'
      );
    }
  }

  async createChannel({ serverId, input, userId }: CreateChannelInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageChannels' });
    await this.assertChannelNameAvailable({ serverId, type: input.type, name: input.name });

    if (isNonNullish(input.categoryId)) {
      const category = await this.prisma.category.findFirst({
        where: { id: input.categoryId, serverId },
        select: { id: true }
      });

      if (isNullish(category)) {
        throw new AppNotFoundException('CATEGORY_NOT_FOUND', 'Category not found');
      }
    }

    const last = await this.prisma.room.findFirst({
      where: { serverId, categoryId: input.categoryId ?? null },
      orderBy: { position: 'desc' },
      select: { position: true }
    });

    const isPrivate = input.isPrivate ?? false;

    const created = await this.prisma.room.create({
      data: {
        serverId,
        categoryId: input.categoryId ?? null,
        name: input.name,
        type: input.type,
        topic: input.topic ?? null,
        slowMode: input.slowMode ?? 0,
        nsfw: input.nsfw ?? false,
        userLimit: input.userLimit ?? null,
        isPrivate,
        position: (last?.position ?? -1) + 1,
        ownerId: userId
      },
      select: channelSelect
    });

    if (isPrivate) {
      await this.lockChannelToCreator({ serverId, channelId: created.id, userId });
    }

    const channel = mapChannel(created);

    emitServerEvent(serverId, { type: 'channel.create', serverId, channel });

    return channel;
  }

  private async lockChannelToCreator({
    serverId,
    channelId,
    userId
  }: {
    serverId: string;
    channelId: string;
    userId: string;
  }) {
    const [defaultRole, member] = await Promise.all([
      this.prisma.serverRole.findFirst({
        where: { serverId, isDefault: true },
        select: { id: true }
      }),
      this.prisma.serverMember.findUnique({
        where: { serverId_userId: { serverId, userId } },
        select: { id: true }
      })
    ]);

    if (isNullish(defaultRole) || isNullish(member)) {
      return;
    }

    await this.prisma.channelOverwrite.createMany({
      data: [
        {
          channelId,
          target: OverwriteTarget.role,
          roleId: defaultRole.id,
          allow: 0n,
          deny: PERMISSIONS.viewChannel
        },
        {
          channelId,
          target: OverwriteTarget.member,
          memberId: member.id,
          allow: PERMISSIONS.viewChannel,
          deny: 0n
        }
      ]
    });
  }

  async updateChannel({ channelId, input, userId }: UpdateChannelInput) {
    const { serverId } = await assertChannelPermission({
      channelId,
      userId,
      permission: 'manageChannels'
    });

    const current = await this.prisma.room.findUnique({
      where: { id: channelId },
      select: { name: true, type: true }
    });

    if (isNullish(current)) {
      throw new AppNotFoundException('CHANNEL_NOT_FOUND', 'Channel not found');
    }

    if (isNonNullish(input.name) && input.name !== current.name) {
      await this.assertChannelNameAvailable({ serverId, type: current.type, name: input.name });
    }

    if (isNonNullish(input.categoryId)) {
      const category = await this.prisma.category.findFirst({
        where: { id: input.categoryId, serverId },
        select: { id: true }
      });

      if (isNullish(category)) {
        throw new AppNotFoundException('CATEGORY_NOT_FOUND', 'Category not found');
      }
    }

    const updated = await this.prisma.room.update({
      where: { id: channelId },
      data: {
        name: input.name,
        categoryId: input.categoryId,
        topic: input.topic,
        slowMode: input.slowMode,
        nsfw: input.nsfw,
        userLimit: input.userLimit,
        position: input.position,
        isPrivate: input.isPrivate
      },
      select: channelSelect
    });

    if (isNonNullish(input.isPrivate)) {
      revokeRoomGrants(channelId);
    }

    const mapped = mapChannel(updated);

    emitServerEvent(serverId, { type: 'channel.update', serverId, channel: mapped });

    return mapped;
  }

  async deleteChannel({ channelId, userId }: DeleteChannelInput) {
    const { serverId } = await assertChannelPermission({
      channelId,
      userId,
      permission: 'manageChannels'
    });

    await this.prisma.room.delete({ where: { id: channelId } });

    revokeRoomGrants(channelId);
    await closeLivekitRoom(channelId);

    emitServerEvent(serverId, { type: 'channel.delete', serverId, channelId });
  }

  async reorderChannels({ serverId, input, userId }: ReorderChannelsInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageChannels' });

    const categoryIds = [
      ...new Set(input.channels.map(({ categoryId }) => categoryId).filter(isNonNullish))
    ];

    if (!isEmpty(categoryIds)) {
      const found = await this.prisma.category.count({
        where: { id: { in: categoryIds }, serverId }
      });

      if (found !== categoryIds.length) {
        throw new AppNotFoundException('CATEGORY_NOT_FOUND', 'Category not found');
      }
    }

    await this.prisma.$transaction(
      input.channels.map(({ id, position, categoryId }) =>
        this.prisma.room.update({
          where: { id, serverId },
          data: { position, categoryId }
        })
      )
    );

    const [categories, channels] = await Promise.all([
      this.prisma.category.findMany({
        where: { serverId },
        orderBy: { position: 'asc' },
        select: categorySelect
      }),
      this.prisma.room.findMany({
        where: { serverId },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        select: channelSelect
      })
    ]);

    const payload = {
      categories: categories.map(mapCategory),
      channels: channels.map(mapChannel)
    };

    emitServerEvent(serverId, { type: 'channel.reorder', serverId, ...payload });

    return payload;
  }
}
