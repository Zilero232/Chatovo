import { ALL_PERMISSIONS, parsePermissions } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';
import { match } from 'ts-pattern';

import type {
  DeleteOverwriteInput,
  ListCategoryOverwritesInput,
  ListOverwritesInput,
  PutCategoryOverwriteInput,
  PutOverwriteInput
} from './overwrites.service.types';

import { AppForbiddenException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import {
  assertChannelPermission,
  assertServerPermission,
  loadMemberContext,
  overwriteSelect
} from '../../../../lib';
import { emitServerEvent } from '../../../realtime';
import { mapOverwrite } from '../../lib';

@Injectable()
export class OverwritesService {
  constructor(private readonly prisma: PrismaService) {}

  async listOverwrites({ channelId, userId }: ListOverwritesInput) {
    await assertChannelPermission({ channelId, userId, permission: 'manageRoles' });

    const overwrites = await this.prisma.channelOverwrite.findMany({
      where: { channelId },
      select: overwriteSelect
    });

    return overwrites.map(mapOverwrite);
  }

  /**
   * Editing an overwrite may only touch permission bits the actor holds, so a
   * moderator cannot grant themselves — or anyone else — more than they have.
   */
  private async assertGrantableBits({
    serverId,
    userId,
    bits
  }: {
    serverId: string;
    userId: string;
    bits: bigint;
  }) {
    const context = await loadMemberContext({ serverId, userId });

    if (isNullish(context)) {
      throw new AppForbiddenException('PERMISSION_DENIED', 'Not a member of this server');
    }

    if (context.isOwner || context.permissions === ALL_PERMISSIONS) {
      return;
    }

    if ((bits & ~context.permissions) !== 0n) {
      throw new AppForbiddenException(
        'PERMISSION_DENIED',
        'Cannot change permissions you do not hold'
      );
    }
  }

  private async assertTargetBelongsToServer({
    serverId,
    input
  }: {
    serverId: string;
    input: PutOverwriteInput['input'];
  }) {
    const found = await match(input)
      .with({ target: 'role' }, ({ roleId }) =>
        this.prisma.serverRole.findFirst({ where: { id: roleId, serverId }, select: { id: true } })
      )
      .otherwise(({ memberId }) =>
        this.prisma.serverMember.findFirst({
          where: { id: memberId, serverId },
          select: { id: true }
        })
      );

    if (isNullish(found)) {
      throw new AppNotFoundException(
        input.target === 'role' ? 'ROLE_NOT_FOUND' : 'MEMBER_NOT_FOUND',
        'Overwrite target not found'
      );
    }
  }

  async putOverwrite({ channelId, input, userId }: PutOverwriteInput) {
    const { serverId } = await assertChannelPermission({
      channelId,
      userId,
      permission: 'manageRoles'
    });

    const allow = parsePermissions(input.allow);
    const deny = parsePermissions(input.deny);

    await this.assertGrantableBits({ serverId, userId, bits: allow | deny });
    await this.assertTargetBelongsToServer({ serverId, input });

    const where =
      input.target === 'role'
        ? { channelId_roleId: { channelId, roleId: input.roleId ?? '' } }
        : { channelId_memberId: { channelId, memberId: input.memberId ?? '' } };

    const saved = await this.prisma.channelOverwrite.upsert({
      where,
      create: {
        channelId,
        target: input.target,
        roleId: input.roleId ?? null,
        memberId: input.memberId ?? null,
        allow,
        deny
      },
      update: { allow, deny },
      select: overwriteSelect
    });

    emitServerEvent(serverId, { type: 'permissions.update', serverId });

    return mapOverwrite(saved);
  }

  async deleteOverwrite({ channelId, overwriteId, userId }: DeleteOverwriteInput) {
    const { serverId } = await assertChannelPermission({
      channelId,
      userId,
      permission: 'manageRoles'
    });

    const overwrite = await this.prisma.channelOverwrite.findFirst({
      where: { id: overwriteId, channelId },
      select: { id: true }
    });

    if (isNullish(overwrite)) {
      throw new AppNotFoundException('OVERWRITE_TARGET_INVALID', 'Overwrite not found');
    }

    await this.prisma.channelOverwrite.delete({ where: { id: overwriteId } });

    emitServerEvent(serverId, { type: 'permissions.update', serverId });
  }

  private async assertCategoryBelongsToServer({
    serverId,
    categoryId
  }: {
    serverId: string;
    categoryId: string;
  }) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, serverId },
      select: { id: true }
    });

    if (isNullish(category)) {
      throw new AppNotFoundException('CATEGORY_NOT_FOUND', 'Category not found');
    }
  }

  async listCategoryOverwrites({ serverId, categoryId, userId }: ListCategoryOverwritesInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageRoles' });
    await this.assertCategoryBelongsToServer({ serverId, categoryId });

    const overwrites = await this.prisma.channelOverwrite.findMany({
      where: { categoryId },
      select: overwriteSelect
    });

    return overwrites.map(mapOverwrite);
  }

  async putCategoryOverwrite({ serverId, categoryId, input, userId }: PutCategoryOverwriteInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageRoles' });
    await this.assertCategoryBelongsToServer({ serverId, categoryId });

    const allow = parsePermissions(input.allow);
    const deny = parsePermissions(input.deny);

    await this.assertGrantableBits({ serverId, userId, bits: allow | deny });
    await this.assertTargetBelongsToServer({ serverId, input });

    const where =
      input.target === 'role'
        ? { categoryId_roleId: { categoryId, roleId: input.roleId ?? '' } }
        : { categoryId_memberId: { categoryId, memberId: input.memberId ?? '' } };

    const saved = await this.prisma.channelOverwrite.upsert({
      where,
      create: {
        categoryId,
        target: input.target,
        roleId: input.roleId ?? null,
        memberId: input.memberId ?? null,
        allow,
        deny
      },
      update: { allow, deny },
      select: overwriteSelect
    });

    emitServerEvent(serverId, { type: 'permissions.update', serverId });

    return mapOverwrite(saved);
  }
}
