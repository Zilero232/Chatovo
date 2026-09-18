import { ALL_PERMISSIONS, MAX_ROLES_PER_SERVER, parsePermissions } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { isNonNullish, isNullish } from 'remeda';

import type {
  CreateRoleInput,
  DeleteRoleInput,
  ListRolesInput,
  ReorderRolesInput,
  UpdateRoleInput
} from './roles.service.types';

import {
  AppBadRequestException,
  AppConflictException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import {
  assertRoleHierarchy,
  assertServerMember,
  assertServerPermission,
  loadMemberContext,
  serverRoleSelect
} from '../../../../lib';
import { emitServerEvent } from '../../../realtime';
import { mapRole } from '../../lib';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async listRoles({ serverId, userId }: ListRolesInput) {
    await assertServerMember({ serverId, userId });

    const roles = await this.prisma.serverRole.findMany({
      where: { serverId },
      orderBy: { position: 'desc' },
      select: serverRoleSelect
    });

    return roles.map(mapRole);
  }

  /**
   * A member may only grant permissions they already hold, so a moderator cannot
   * mint a role more powerful than themselves.
   */
  private async assertGrantablePermissions({
    serverId,
    userId,
    permissions
  }: {
    serverId: string;
    userId: string;
    permissions: bigint;
  }) {
    const context = await loadMemberContext({ serverId, userId });

    if (isNullish(context)) {
      throw new AppForbiddenException('PERMISSION_DENIED', 'Not a member of this server');
    }

    if (context.isOwner || context.permissions === ALL_PERMISSIONS) {
      return;
    }

    if ((permissions & ~context.permissions) !== 0n) {
      throw new AppForbiddenException(
        'PERMISSION_DENIED',
        'Cannot grant permissions you do not hold'
      );
    }
  }

  async createRole({ serverId, input, userId }: CreateRoleInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageRoles' });

    const permissions = parsePermissions(input.permissions ?? '0');

    await this.assertGrantablePermissions({ serverId, userId, permissions });

    const [existing, count] = await Promise.all([
      this.prisma.serverRole.findUnique({
        where: { serverId_name: { serverId, name: input.name } },
        select: { id: true }
      }),
      this.prisma.serverRole.count({ where: { serverId } })
    ]);

    if (isNonNullish(existing)) {
      throw new AppConflictException('ROLE_NAME_TAKEN', 'A role with this name already exists');
    }

    if (count >= MAX_ROLES_PER_SERVER) {
      throw new AppBadRequestException('ROLE_LIMIT_REACHED', 'Role limit reached');
    }

    const top = await this.prisma.serverRole.findFirst({
      where: { serverId },
      orderBy: { position: 'desc' },
      select: { position: true }
    });

    const created = await this.prisma.serverRole.create({
      data: {
        serverId,
        name: input.name,
        color: input.color ?? null,
        mentionable: input.mentionable ?? true,
        hoist: input.hoist ?? false,
        permissions,
        position: (top?.position ?? 0) + 1
      },
      select: serverRoleSelect
    });

    const role = mapRole(created);

    emitServerEvent(serverId, { type: 'role.upsert', serverId, role });

    return role;
  }

  private async loadRoleOrThrow({ serverId, roleId }: { serverId: string; roleId: string }) {
    const role = await this.prisma.serverRole.findFirst({
      where: { id: roleId, serverId },
      select: { id: true, position: true, isDefault: true, name: true }
    });

    if (isNullish(role)) {
      throw new AppNotFoundException('ROLE_NOT_FOUND', 'Role not found');
    }

    return role;
  }

  async updateRole({ serverId, roleId, input, userId }: UpdateRoleInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageRoles' });

    const current = await this.loadRoleOrThrow({ serverId, roleId });

    await assertRoleHierarchy({ serverId, actorId: userId, rolePosition: current.position });

    if (current.isDefault && isNonNullish(input.name)) {
      throw new AppBadRequestException(
        'ROLE_DEFAULT_IMMUTABLE',
        'The default role cannot be renamed'
      );
    }

    if (isNonNullish(input.name) && input.name !== current.name) {
      const taken = await this.prisma.serverRole.findUnique({
        where: { serverId_name: { serverId, name: input.name } },
        select: { id: true }
      });

      if (isNonNullish(taken)) {
        throw new AppConflictException('ROLE_NAME_TAKEN', 'A role with this name already exists');
      }
    }

    const permissions = isNonNullish(input.permissions)
      ? parsePermissions(input.permissions)
      : undefined;

    if (isNonNullish(permissions)) {
      await this.assertGrantablePermissions({ serverId, userId, permissions });
    }

    const updated = await this.prisma.serverRole.update({
      where: { id: roleId },
      data: {
        name: input.name,
        color: input.color,
        mentionable: input.mentionable,
        hoist: input.hoist,
        permissions
      },
      select: serverRoleSelect
    });

    const role = mapRole(updated);

    emitServerEvent(serverId, { type: 'role.upsert', serverId, role });
    emitServerEvent(serverId, { type: 'permissions.update', serverId });

    return role;
  }

  async reorderRoles({ serverId, input, userId }: ReorderRolesInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageRoles' });

    const roleIds = input.roles.map(({ id }) => id);

    const current = await this.prisma.serverRole.findMany({
      where: { id: { in: roleIds }, serverId },
      select: { position: true }
    });

    if (current.length !== roleIds.length) {
      throw new AppNotFoundException('ROLE_NOT_FOUND', 'Role not found');
    }

    const highest = Math.max(
      ...input.roles.map(({ position }) => position),
      ...current.map(({ position }) => position)
    );

    await assertRoleHierarchy({ serverId, actorId: userId, rolePosition: highest });

    await this.prisma.$transaction(
      input.roles.map(({ id, position }) =>
        this.prisma.serverRole.update({
          where: { id, serverId },
          data: { position }
        })
      )
    );

    const roles = await this.prisma.serverRole.findMany({
      where: { serverId },
      orderBy: { position: 'desc' },
      select: serverRoleSelect
    });

    roles.forEach((row) => {
      emitServerEvent(serverId, { type: 'role.upsert', serverId, role: mapRole(row) });
    });

    emitServerEvent(serverId, { type: 'permissions.update', serverId });

    return roles.map(mapRole);
  }

  async deleteRole({ serverId, roleId, userId }: DeleteRoleInput) {
    await assertServerPermission({ serverId, userId, permission: 'manageRoles' });

    const role = await this.loadRoleOrThrow({ serverId, roleId });

    if (role.isDefault) {
      throw new AppBadRequestException(
        'ROLE_DEFAULT_IMMUTABLE',
        'The default role cannot be deleted'
      );
    }

    await assertRoleHierarchy({ serverId, actorId: userId, rolePosition: role.position });

    await this.prisma.serverRole.delete({ where: { id: roleId } });

    emitServerEvent(serverId, { type: 'role.delete', serverId, roleId });
    emitServerEvent(serverId, { type: 'permissions.update', serverId });
  }
}
