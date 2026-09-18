import { Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { isNonNullish, isNullish } from 'remeda';

import type {
  CreateInviteInput,
  JoinServerInput,
  ListInvitesInput,
  PreviewInviteInput,
  RevokeInviteInput
} from './invites.service.types';

import { ServerMemberRole } from '../../../../../generated';
import {
  AppBadRequestException,
  AppConflictException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import {
  assertServerPermission,
  serverInviteSelect,
  serverMemberSelect,
  serverSelect
} from '../../../../lib';
import { emitServerEvent } from '../../../realtime';
import { generateInviteCode, mapInvite, mapMember, mapServer } from '../../lib';

@Injectable()
export class InvitesService {
  constructor(private readonly prisma: PrismaService) {}

  async listInvites({ serverId, userId }: ListInvitesInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageServer' });

    const invites = await this.prisma.serverInvite.findMany({
      where: { serverId, revokedAt: null },
      orderBy: { createdAt: 'desc' },
      select: serverInviteSelect
    });

    return invites.map(mapInvite);
  }

  async createInvite({ serverId, input, userId }: CreateInviteInput) {
    await assertServerPermission({ serverId, userId, permission: 'createInvite' });

    const expiresAt = isNonNullish(input.expiresInMinutes)
      ? addMinutes(new Date(), input.expiresInMinutes)
      : null;

    const created = await this.prisma.serverInvite.create({
      data: {
        serverId,
        code: generateInviteCode(),
        creatorId: userId,
        maxUses: input.maxUses ?? null,
        expiresAt
      },
      select: serverInviteSelect
    });

    return mapInvite(created);
  }

  async revokeInvite({ serverId, inviteId, userId }: RevokeInviteInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageServer' });

    const invite = await this.prisma.serverInvite.findFirst({
      where: { id: inviteId, serverId },
      select: { id: true }
    });

    if (isNullish(invite)) {
      throw new AppNotFoundException('INVITE_NOT_FOUND', 'Invite not found');
    }

    await this.prisma.serverInvite.update({
      where: { id: inviteId },
      data: { revokedAt: new Date() }
    });
  }

  private async loadUsableInviteOrThrow(code: string) {
    const invite = await this.prisma.serverInvite.findUnique({
      where: { code },
      select: {
        id: true,
        serverId: true,
        creatorId: true,
        maxUses: true,
        uses: true,
        expiresAt: true,
        revokedAt: true,
        server: { select: serverSelect }
      }
    });

    if (isNullish(invite) || isNonNullish(invite.revokedAt)) {
      throw new AppNotFoundException('INVITE_NOT_FOUND', 'Invite not found');
    }

    if (isNonNullish(invite.expiresAt) && invite.expiresAt.getTime() < Date.now()) {
      throw new AppBadRequestException('INVITE_EXPIRED', 'This invite has expired');
    }

    if (isNonNullish(invite.maxUses) && invite.uses >= invite.maxUses) {
      throw new AppBadRequestException('INVITE_MAX_USES', 'This invite has no uses left');
    }

    return invite;
  }

  async previewInvite({ code, userId }: PreviewInviteInput) {
    const invite = await this.loadUsableInviteOrThrow(code);
    const server = mapServer(invite.server);

    const membership = await this.prisma.serverMember.findUnique({
      where: { serverId_userId: { serverId: invite.serverId, userId } },
      select: { id: true }
    });

    return {
      code,
      serverId: server.id,
      serverName: server.name,
      serverIconUrl: server.iconUrl,
      memberCount: server.memberCount,
      isMember: isNonNullish(membership)
    };
  }

  async joinServer({ code, userId }: JoinServerInput) {
    const invite = await this.loadUsableInviteOrThrow(code);

    const existing = await this.prisma.serverMember.findUnique({
      where: { serverId_userId: { serverId: invite.serverId, userId } },
      select: { id: true }
    });

    if (isNonNullish(existing)) {
      throw new AppConflictException('MEMBER_ALREADY_JOINED', 'Already a member of this server');
    }

    const ban = await this.prisma.serverBan.findUnique({
      where: { serverId_userId: { serverId: invite.serverId, userId } },
      select: { id: true }
    });

    if (isNonNullish(ban)) {
      throw new AppForbiddenException('MEMBER_BANNED', 'You are banned from this server');
    }

    const member = await this.prisma.$transaction(async (tx) => {
      await tx.serverInvite.update({
        where: { id: invite.id },
        data: { uses: { increment: 1 } }
      });

      return tx.serverMember.create({
        data: {
          serverId: invite.serverId,
          userId,
          role: ServerMemberRole.member,
          invitedById: invite.creatorId
        },
        select: serverMemberSelect
      });
    });

    const mapped = mapMember(member);

    emitServerEvent(invite.serverId, {
      type: 'member.join',
      serverId: invite.serverId,
      member: mapped
    });

    return mapServer(invite.server);
  }
}
