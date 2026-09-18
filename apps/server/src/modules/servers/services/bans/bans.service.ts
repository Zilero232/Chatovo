import { Injectable } from '@nestjs/common';
import { isNonNullish, isNullish } from 'remeda';

import type { BanMemberInput, ListBansInput, UnbanMemberInput } from './bans.service.types';

import { AppForbiddenException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { assertMemberHierarchy, assertServerPermission } from '../../../../lib';
import { emitServerEvent } from '../../../realtime';
import { mapBan } from '../../lib';

const banSelect = {
  id: true,
  serverId: true,
  userId: true,
  reason: true,
  bannedById: true,
  createdAt: true,
  user: { select: { name: true, profile: { select: { displayName: true, avatarUrl: true } } } }
} as const;

@Injectable()
export class BansService {
  constructor(private readonly prisma: PrismaService) {}

  async listBans({ serverId, userId }: ListBansInput) {
    await assertServerPermission({ serverId, userId, permission: 'banMembers' });

    const bans = await this.prisma.serverBan.findMany({
      where: { serverId },
      orderBy: { createdAt: 'desc' },
      select: banSelect
    });

    return bans.map(mapBan);
  }

  async banMember({ serverId, targetUserId, input, userId }: BanMemberInput) {
    await assertServerPermission({ serverId, userId, permission: 'banMembers' });

    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: { ownerId: true }
    });

    if (isNullish(server)) {
      throw new AppNotFoundException('SERVER_NOT_FOUND', 'Server not found');
    }

    if (server.ownerId === targetUserId) {
      throw new AppForbiddenException('MEMBER_HIERARCHY', 'Cannot ban the server owner');
    }

    const member = await this.prisma.serverMember.findUnique({
      where: { serverId_userId: { serverId, userId: targetUserId } },
      select: { id: true }
    });

    if (isNonNullish(member)) {
      await assertMemberHierarchy({ serverId, actorId: userId, targetUserId });
    }

    const ban = await this.prisma.$transaction(async (tx) => {
      await tx.serverMember.deleteMany({ where: { serverId, userId: targetUserId } });

      return tx.serverBan.upsert({
        where: { serverId_userId: { serverId, userId: targetUserId } },
        create: {
          serverId,
          userId: targetUserId,
          bannedById: userId,
          reason: input.reason ?? null
        },
        update: { bannedById: userId, reason: input.reason ?? null },
        select: banSelect
      });
    });

    if (isNonNullish(member)) {
      emitServerEvent(serverId, { type: 'member.leave', serverId, userId: targetUserId });
    }

    return mapBan(ban);
  }

  async unbanMember({ serverId, targetUserId, userId }: UnbanMemberInput) {
    await assertServerPermission({ serverId, userId, permission: 'banMembers' });

    const ban = await this.prisma.serverBan.findUnique({
      where: { serverId_userId: { serverId, userId: targetUserId } },
      select: { id: true }
    });

    if (isNullish(ban)) {
      throw new AppNotFoundException('MEMBER_NOT_FOUND', 'Ban not found');
    }

    await this.prisma.serverBan.delete({ where: { id: ban.id } });
  }
}
