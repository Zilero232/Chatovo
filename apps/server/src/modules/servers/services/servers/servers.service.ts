import { AVATAR_MAX_BYTES, DEFAULT_ROLE_PERMISSIONS } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { extension } from 'mime-types';
import { isNonNullish, isNullish } from 'remeda';

import type {
  CreateServerInput,
  DeleteServerInput,
  GetServerInput,
  LeaveServerInput,
  UpdateServerIconInput,
  UpdateServerInput
} from './servers.service.types';

import { ChannelType, ServerMemberRole } from '../../../../../generated';
import {
  AppBadRequestException,
  AppConflictException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import {
  DEFAULT_CATEGORY_NAME,
  DEFAULT_ROLE_NAME,
  DEFAULT_TEXT_CHANNEL_NAME,
  DEFAULT_VOICE_CHANNEL_NAME
} from '../../../../config/servers.config';
import { PrismaService } from '../../../../core';
import { assertServerMember, assertServerPermission, serverSelect } from '../../../../lib';
import { emitServerEvent } from '../../../realtime';
import { deleteUploadDirectory, saveUpload, toArrayBuffer } from '../../../uploads';
import { mapServer, toServerSlugBase } from '../../lib';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  async listServers(userId: string) {
    const members = await this.prisma.serverMember.findMany({
      where: { userId },
      orderBy: { joinedAt: 'asc' },
      select: { server: { select: serverSelect } }
    });

    return members.map(({ server }) => mapServer(server));
  }

  async getServer({ serverId, userId }: GetServerInput) {
    await assertServerMember({ serverId, userId });

    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: serverSelect
    });

    if (isNullish(server)) {
      throw new AppNotFoundException('SERVER_NOT_FOUND', 'Server not found');
    }

    return mapServer(server);
  }

  private async issueUniqueSlug(base: string) {
    const taken = await this.prisma.server.findMany({
      where: { slug: { startsWith: base } },
      select: { slug: true }
    });

    if (!taken.some(({ slug }) => slug === base)) {
      return base;
    }

    const used = new Set(taken.map(({ slug }) => slug));

    for (let suffix = 2; suffix < 1000; suffix += 1) {
      const candidate = `${base}-${suffix}`;

      if (!used.has(candidate)) {
        return candidate;
      }
    }

    throw new AppConflictException('SERVER_SLUG_TAKEN', 'Could not allocate a server slug');
  }

  async createServer({ input, ownerId }: CreateServerInput) {
    const base = input.slug ?? toServerSlugBase(input.name);
    const slug = await this.issueUniqueSlug(base);

    const created = await this.prisma.$transaction(async (tx) => {
      const server = await tx.server.create({
        data: {
          name: input.name,
          slug,
          description: input.description ?? null,
          bannerColor: input.bannerColor ?? null,
          ownerId
        },
        select: { id: true }
      });

      await tx.serverRole.create({
        data: {
          serverId: server.id,
          name: DEFAULT_ROLE_NAME,
          position: 0,
          permissions: DEFAULT_ROLE_PERMISSIONS,
          isDefault: true,
          mentionable: false
        }
      });

      await tx.serverMember.create({
        data: { serverId: server.id, userId: ownerId, role: ServerMemberRole.owner }
      });

      const category = await tx.category.create({
        data: { serverId: server.id, name: DEFAULT_CATEGORY_NAME, position: 0 },
        select: { id: true }
      });

      const textChannel = await tx.room.create({
        data: {
          serverId: server.id,
          categoryId: category.id,
          name: DEFAULT_TEXT_CHANNEL_NAME,
          type: ChannelType.text,
          position: 0,
          ownerId
        },
        select: { id: true }
      });

      await tx.room.create({
        data: {
          serverId: server.id,
          categoryId: category.id,
          name: DEFAULT_VOICE_CHANNEL_NAME,
          type: ChannelType.voice,
          position: 1,
          ownerId
        }
      });

      return tx.server.update({
        where: { id: server.id },
        data: { systemChannelId: textChannel.id },
        select: serverSelect
      });
    });

    return mapServer(created);
  }

  async updateServer({ serverId, input, userId }: UpdateServerInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageServer' });

    if (isNonNullish(input.systemChannelId)) {
      const channel = await this.prisma.room.findFirst({
        where: { id: input.systemChannelId, serverId, type: ChannelType.text },
        select: { id: true }
      });

      if (isNullish(channel)) {
        throw new AppNotFoundException('CHANNEL_NOT_FOUND', 'System channel not found');
      }
    }

    const updated = await this.prisma.server.update({
      where: { id: serverId },
      data: {
        name: input.name,
        description: input.description,
        bannerColor: input.bannerColor,
        iconUrl: input.iconUrl,
        systemChannelId: input.systemChannelId
      },
      select: serverSelect
    });

    const server = mapServer(updated);

    emitServerEvent(serverId, { type: 'server.update', server });

    return server;
  }

  async updateIcon({ serverId, file, userId }: UpdateServerIconInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageServer' });

    if (!file.mimetype.startsWith('image/')) {
      throw new AppBadRequestException('FILE_NOT_IMAGE', 'Icon must be an image');
    }

    if (file.size > AVATAR_MAX_BYTES) {
      throw new AppBadRequestException('IMAGE_TOO_LARGE', 'Icon is too large');
    }

    const ext = extension(file.mimetype) || 'png';
    const key = `servers/${serverId}/icon-${Date.now()}.${ext}`;

    await deleteUploadDirectory(`servers/${serverId}`);

    const iconUrl = await saveUpload(key, toArrayBuffer(file.buffer));

    return this.saveIcon({ serverId, iconUrl });
  }

  async removeIcon({ serverId, userId }: GetServerInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageServer' });

    await deleteUploadDirectory(`servers/${serverId}`);

    return this.saveIcon({ serverId, iconUrl: null });
  }

  private async saveIcon({ serverId, iconUrl }: { serverId: string; iconUrl: string | null }) {
    const updated = await this.prisma.server.update({
      where: { id: serverId },
      data: { iconUrl },
      select: serverSelect
    });

    const server = mapServer(updated);

    emitServerEvent(serverId, { type: 'server.update', server });

    return server;
  }

  async deleteServer({ serverId, userId }: DeleteServerInput) {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: { ownerId: true }
    });

    if (isNullish(server)) {
      throw new AppNotFoundException('SERVER_NOT_FOUND', 'Server not found');
    }

    if (server.ownerId !== userId) {
      throw new AppForbiddenException(
        'SERVER_OWNER_REQUIRED',
        'Only the owner can delete a server'
      );
    }

    await this.prisma.server.delete({ where: { id: serverId } });

    emitServerEvent(serverId, { type: 'server.delete', serverId });
  }

  async leaveServer({ serverId, userId }: LeaveServerInput) {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: { ownerId: true }
    });

    if (isNullish(server)) {
      throw new AppNotFoundException('SERVER_NOT_FOUND', 'Server not found');
    }

    if (server.ownerId === userId) {
      throw new AppForbiddenException(
        'SERVER_OWNER_CANNOT_LEAVE',
        'Transfer ownership or delete the server instead'
      );
    }

    await this.prisma.serverMember.delete({
      where: { serverId_userId: { serverId, userId } }
    });

    emitServerEvent(serverId, { type: 'member.leave', serverId, userId });
  }

  async transferOwnership({
    serverId,
    userId,
    targetUserId
  }: {
    serverId: string;
    userId: string;
    targetUserId: string;
  }) {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: { ownerId: true }
    });

    if (server?.ownerId !== userId) {
      throw new AppForbiddenException(
        'SERVER_OWNER_REQUIRED',
        'Only the owner can transfer a server'
      );
    }

    const target = await this.prisma.serverMember.findUnique({
      where: { serverId_userId: { serverId, userId: targetUserId } },
      select: { id: true }
    });

    if (isNullish(target)) {
      throw new AppNotFoundException('MEMBER_NOT_FOUND', 'Member not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.serverMember.update({
        where: { serverId_userId: { serverId, userId } },
        data: { role: ServerMemberRole.admin }
      });

      await tx.serverMember.update({
        where: { serverId_userId: { serverId, userId: targetUserId } },
        data: { role: ServerMemberRole.owner }
      });

      return tx.server.update({
        where: { id: serverId },
        data: { ownerId: targetUserId },
        select: serverSelect
      });
    });

    const transferred = mapServer(updated);

    emitServerEvent(serverId, { type: 'server.update', server: transferred });

    return transferred;
  }
}
