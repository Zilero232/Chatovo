import type { AdminUserQuery } from '@chatovo/schemas';

import { USER_ROLE } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';
import { match } from 'ts-pattern';

import type { Prisma } from '../../../../../generated';
import type {
  ListOnlineUsersInput,
  ListUserMessagesInput,
  UpdateAdminUserInput
} from '../../moderation.service.types';

import { AppBadRequestException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { ejectParticipantEverywhere, revokeUserGrants } from '../../../livekit';
import {
  closeUserConnections,
  listOnlineUserIds,
  ROLE_CHANGED_WS_CLOSE_CODE
} from '../../../realtime';
import { toPageArgs } from '../../lib';
import { adminUserInclude, toAbuseReport, toAdminUser, toAdminUserMessage } from '../../mappers';

@Injectable()
export class AdminUserService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: AdminUserQuery) {
    const { search, filter, page, perPage } = query;

    const where: Prisma.UserWhereInput = {
      ...this.filterClause(filter),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' as const } },
              { name: { contains: search, mode: 'insensitive' as const } },
              { friendTag: { contains: search, mode: 'insensitive' as const } }
            ]
          }
        : {})
    };

    if (filter === 'online') {
      return this.listOnline({ where, page, perPage });
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: adminUserInclude,
        orderBy: { createdAt: 'desc' },
        ...toPageArgs({ page, perPage })
      }),
      this.prisma.user.count({ where })
    ]);

    return { items: items.map(toAdminUser), total };
  }

  async get(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: adminUserInclude
    });

    if (isNullish(user)) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    return toAdminUser(user);
  }

  async details(userId: string) {
    const user = await this.get(userId);

    const [ownedRooms, reportsAgainst, reportsFiled, sessions, lastMessage] = await Promise.all([
      this.prisma.room.findMany({
        where: { ownerId: userId },
        select: { id: true, name: true, kind: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      this.prisma.abuseReport.findMany({
        where: { target: 'user', targetId: userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      this.prisma.abuseReport.count({ where: { reporterId: userId } }),
      this.prisma.session.count({ where: { userId } }),
      this.prisma.message.findFirst({
        where: { senderId: userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      })
    ]);

    return {
      user,
      ownedRooms: ownedRooms.map((room) => ({ ...room, createdAt: room.createdAt.toISOString() })),
      reportsAgainst: reportsAgainst.map(toAbuseReport),
      reportsFiled,
      sessions,
      lastMessageAt: lastMessage?.createdAt.toISOString() ?? null
    };
  }

  async messages({ userId, query }: ListUserMessagesInput) {
    const { page, perPage } = query;
    const where = { senderId: userId };

    const [items, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        include: { room: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        ...toPageArgs({ page, perPage })
      }),
      this.prisma.message.count({ where })
    ]);

    return { items: items.map(toAdminUserMessage), total };
  }

  async update({ adminId, userId, input }: UpdateAdminUserInput) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });

    if (isNullish(user)) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    const { role, verified, ...profile } = input;

    if (role === USER_ROLE.user && userId === adminId) {
      throw new AppBadRequestException('BLOCK_SELF', 'Cannot drop your own admin role');
    }

    const account = { ...(role ? { role } : {}), ...(verified === undefined ? {} : { verified }) };

    await this.prisma.$transaction(async (tx) => {
      if (Object.keys(account).length > 0) {
        await tx.user.update({ where: { id: userId }, data: account });
      }

      if (Object.keys(profile).length > 0) {
        await tx.profile.upsert({
          where: { userId },
          create: { userId, ...profile },
          update: profile
        });
      }

      if (role) {
        await tx.session.deleteMany({ where: { userId } });
      }
    });

    if (role) {
      await this.dropPrivileges(userId);
    }

    return this.get(userId);
  }

  private async listOnline({ where, page, perPage }: ListOnlineUsersInput) {
    const onlineIds = listOnlineUserIds();

    if (onlineIds.length === 0) {
      return { items: [], total: 0 };
    }

    const scoped: Prisma.UserWhereInput = { ...where, id: { in: onlineIds } };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where: scoped,
        include: adminUserInclude,
        orderBy: { createdAt: 'desc' },
        ...toPageArgs({ page, perPage })
      }),
      this.prisma.user.count({ where: scoped })
    ]);

    return { items: items.map(toAdminUser), total };
  }

  private async dropPrivileges(userId: string) {
    revokeUserGrants(userId);
    closeUserConnections(userId, ROLE_CHANGED_WS_CLOSE_CODE, 'Role changed');

    await ejectParticipantEverywhere(userId);
  }

  private filterClause(filter: AdminUserQuery['filter']): Prisma.UserWhereInput {
    return match(filter)
      .with('blocked', () => ({ blockedAt: { not: null } }))
      .with('admins', () => ({ role: USER_ROLE.admin }))
      .otherwise(() => ({}));
  }
}
