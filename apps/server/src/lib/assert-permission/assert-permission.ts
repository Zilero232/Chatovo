import { hasPermission } from '@chatovo/schemas';
import { isNonNullish, isNullish } from 'remeda';

import type {
  AssertChannelPermissionInput,
  AssertMemberHierarchyInput,
  AssertServerPermissionInput
} from './assert-permission.types';

import { AppForbiddenException, AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import {
  getMemberTopRolePosition,
  loadMemberContext,
  resolveChannelPermissions
} from '../resolve-member-permissions';

/** Asserts server-wide membership and returns the member context for reuse. */
export const assertServerMember = async ({
  serverId,
  userId
}: {
  serverId: string;
  userId: string;
}) => {
  const context = await loadMemberContext({ serverId, userId });

  if (isNullish(context)) {
    throw new AppForbiddenException('PERMISSION_DENIED', 'Not a member of this server');
  }

  return context;
};

export const assertServerPermission = async ({
  serverId,
  userId,
  permission
}: AssertServerPermissionInput) => {
  const context = await assertServerMember({ serverId, userId });

  if (!hasPermission(context.permissions, permission)) {
    throw new AppForbiddenException('PERMISSION_DENIED', `Missing permission: ${permission}`);
  }

  return context;
};

/** Resolves the channel's server, then asserts the permission against that channel's mask. */
export const assertChannelPermission = async ({
  channelId,
  userId,
  permission
}: AssertChannelPermissionInput) => {
  const channel = await prisma.room.findUnique({
    where: { id: channelId },
    select: { id: true, serverId: true, type: true, categoryId: true, archivedAt: true }
  });

  if (isNullish(channel)) {
    throw new AppNotFoundException('CHANNEL_NOT_FOUND', 'Channel not found');
  }

  if (isNullish(channel.serverId)) {
    throw new AppForbiddenException('PERMISSION_DENIED', 'Channel does not belong to a server');
  }

  const permissions = await resolveChannelPermissions({
    serverId: channel.serverId,
    userId,
    channelId
  });

  if (!hasPermission(permissions, permission)) {
    throw new AppForbiddenException('PERMISSION_DENIED', `Missing permission: ${permission}`);
  }

  return { channel, serverId: channel.serverId, permissions };
};

/** A timed-out member keeps reading but cannot post or speak until `mutedUntil` passes. */
export const assertNotTimedOut = async ({
  serverId,
  userId
}: {
  serverId: string;
  userId: string;
}) => {
  const member = await prisma.serverMember.findUnique({
    where: { serverId_userId: { serverId, userId } },
    select: { mutedUntil: true }
  });

  if (isNonNullish(member?.mutedUntil) && member.mutedUntil.getTime() > Date.now()) {
    throw new AppForbiddenException('MEMBER_TIMED_OUT', 'You are timed out on this server');
  }
};

/**
 * Blocks acting on a member whose highest role sits at or above the actor's.
 * The server owner always outranks everyone.
 */
export const assertMemberHierarchy = async ({
  serverId,
  actorId,
  targetUserId
}: AssertMemberHierarchyInput) => {
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    select: { ownerId: true }
  });

  if (isNullish(server)) {
    throw new AppNotFoundException('SERVER_NOT_FOUND', 'Server not found');
  }

  if (server.ownerId === targetUserId) {
    throw new AppForbiddenException('MEMBER_HIERARCHY', 'Cannot act on the server owner');
  }

  if (server.ownerId === actorId) {
    return;
  }

  const [actorPosition, targetPosition] = await Promise.all([
    getMemberTopRolePosition({ serverId, userId: actorId }),
    getMemberTopRolePosition({ serverId, userId: targetUserId })
  ]);

  if (actorPosition <= targetPosition) {
    throw new AppForbiddenException('MEMBER_HIERARCHY', 'Target member outranks you');
  }
};

/** Blocks editing or assigning a role that sits at or above the actor's own top role. */
export const assertRoleHierarchy = async ({
  serverId,
  actorId,
  rolePosition
}: {
  serverId: string;
  actorId: string;
  rolePosition: number;
}) => {
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    select: { ownerId: true }
  });

  if (server?.ownerId === actorId) {
    return;
  }

  const actorPosition = await getMemberTopRolePosition({ serverId, userId: actorId });

  if (actorPosition <= rolePosition) {
    throw new AppForbiddenException('MEMBER_HIERARCHY', 'Role outranks you');
  }
};
