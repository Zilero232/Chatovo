import { Injectable } from '@nestjs/common';
import { isEmpty, isNonNullish, isNullish } from 'remeda';

import type { KickMemberInput, ListMembersInput, UpdateMemberInput } from './members.service.types';

import { AppForbiddenException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import {
  assertMemberHierarchy,
  assertRoleHierarchy,
  assertServerMember,
  assertServerPermission,
  serverMemberSelect
} from '../../../../lib';
import { emitServerEvent } from '../../../realtime';
import { mapMember } from '../../lib';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async listMembers({ serverId, userId }: ListMembersInput) {
    await assertServerMember({ serverId, userId });

    const members = await this.prisma.serverMember.findMany({
      where: { serverId },
      orderBy: { joinedAt: 'asc' },
      select: serverMemberSelect
    });

    return members.map(mapMember);
  }

  private async loadMemberOrThrow({
    serverId,
    targetUserId
  }: {
    serverId: string;
    targetUserId: string;
  }) {
    const member = await this.prisma.serverMember.findUnique({
      where: { serverId_userId: { serverId, userId: targetUserId } },
      select: { id: true }
    });

    if (isNullish(member)) {
      throw new AppNotFoundException('MEMBER_NOT_FOUND', 'Member not found');
    }

    return member;
  }

  private async assertRolesBelongToServer({
    serverId,
    roleIds
  }: {
    serverId: string;
    roleIds: string[];
  }) {
    const roles = await this.prisma.serverRole.findMany({
      where: { id: { in: roleIds }, serverId },
      select: { id: true, isDefault: true, position: true }
    });

    if (roles.length !== roleIds.length) {
      throw new AppNotFoundException('ROLE_NOT_FOUND', 'Role not found');
    }

    return roles;
  }

  private async assertRolesAreAssignable({
    serverId,
    actorId,
    memberId,
    roleIds
  }: {
    serverId: string;
    actorId: string;
    memberId: string;
    roleIds: string[];
  }) {
    const [requested, current] = await Promise.all([
      this.prisma.serverRole.findMany({
        where: { id: { in: roleIds }, serverId },
        select: { position: true }
      }),
      this.prisma.serverRole.findMany({
        where: { serverId, isDefault: false, members: { some: { memberId } } },
        select: { position: true }
      })
    ]);

    const positions = [...requested, ...current].map((role) => role.position);

    if (isEmpty(positions)) {
      return;
    }

    await assertRoleHierarchy({ serverId, actorId, rolePosition: Math.max(...positions) });
  }

  async updateMember({ serverId, targetUserId, input, userId }: UpdateMemberInput) {
    const isSelf = targetUserId === userId;

    if (isNonNullish(input.nickname)) {
      await assertServerPermission({
        serverId,
        userId,
        permission: isSelf ? 'changeNickname' : 'manageNicknames'
      });
    }

    if (isNonNullish(input.roleIds)) {
      await assertServerPermission({ serverId, userId, permission: 'manageRoles' });
      await assertMemberHierarchy({ serverId, actorId: userId, targetUserId });
      await this.assertRolesBelongToServer({ serverId, roleIds: input.roleIds });
    }

    if (isNonNullish(input.mutedUntil)) {
      await assertServerPermission({ serverId, userId, permission: 'muteMembers' });
      await assertMemberHierarchy({ serverId, actorId: userId, targetUserId });
    }

    const member = await this.loadMemberOrThrow({ serverId, targetUserId });

    if (isNonNullish(input.roleIds)) {
      await this.assertRolesAreAssignable({
        serverId,
        actorId: userId,
        memberId: member.id,
        roleIds: input.roleIds
      });

      const assignable = input.roleIds.filter((roleId) => roleId.length > 0);

      await this.prisma.$transaction([
        this.prisma.serverMemberRoleLink.deleteMany({
          where: { memberId: member.id, role: { isDefault: false } }
        }),
        this.prisma.serverMemberRoleLink.createMany({
          data: assignable.map((roleId) => ({ memberId: member.id, roleId })),
          skipDuplicates: true
        })
      ]);
    }

    const updated = await this.prisma.serverMember.update({
      where: { id: member.id },
      data: {
        nickname: input.nickname,
        mutedUntil: isNullish(input.mutedUntil) ? input.mutedUntil : new Date(input.mutedUntil)
      },
      select: serverMemberSelect
    });

    const mapped = mapMember(updated);

    emitServerEvent(serverId, { type: 'member.update', serverId, member: mapped });
    emitServerEvent(serverId, { type: 'permissions.update', serverId });

    return mapped;
  }

  async kickMember({ serverId, targetUserId, userId }: KickMemberInput) {
    await assertServerPermission({ serverId, userId, permission: 'kickMembers' });
    await assertMemberHierarchy({ serverId, actorId: userId, targetUserId });

    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: { ownerId: true }
    });

    if (server?.ownerId === targetUserId) {
      throw new AppForbiddenException('MEMBER_HIERARCHY', 'Cannot kick the server owner');
    }

    await this.loadMemberOrThrow({ serverId, targetUserId });

    await this.prisma.serverMember.delete({
      where: { serverId_userId: { serverId, userId: targetUserId } }
    });

    emitServerEvent(serverId, { type: 'member.leave', serverId, userId: targetUserId });
  }
}
