import {
  DEFAULT_ROLE_PERMISSIONS,
  resolvePermissions,
  TEXT_ONLY_PERMISSIONS,
  VOICE_ONLY_PERMISSIONS
} from '@chatovo/schemas';
import { isNullish, sortBy } from 'remeda';
import { match } from 'ts-pattern';

import type {
  MemberPermissionContext,
  OverwriteRow,
  ResolveMemberPermissionsInput
} from './resolve-member-permissions.types';

import { ChannelType } from '../../../generated';
import { basePrisma as prisma } from '../../core';

const overwriteRowSelect = {
  target: true,
  roleId: true,
  memberId: true,
  allow: true,
  deny: true
} as const;

const toOverwritePair = ({ allow, deny }: OverwriteRow) => ({ allow, deny });

const splitOverwrites = ({
  overwrites,
  roleIds,
  memberId
}: {
  overwrites: OverwriteRow[];
  roleIds: string[];
  memberId: string;
}) => {
  const roleSet = new Set(roleIds);

  const roleOverwrites = overwrites
    .filter((row) => row.target === 'role' && !isNullish(row.roleId) && roleSet.has(row.roleId))
    .map(toOverwritePair);

  const memberOverwrite = overwrites
    .filter((row) => row.target === 'member' && row.memberId === memberId)
    .map(toOverwritePair)
    .at(0);

  return { roleOverwrites, memberOverwrite };
};

/**
 * Strips permissions that cannot apply to a channel of this type, so a text-only
 * bit never leaks into a voice channel's effective mask, or the other way around.
 */
export const maskForChannelType = (mask: bigint, type: ChannelType) =>
  match(type)
    .with(ChannelType.voice, () => mask & ~TEXT_ONLY_PERMISSIONS)
    .otherwise(() => mask & ~VOICE_ONLY_PERMISSIONS);

/**
 * Loads a member with the roles that decide their server-wide permissions.
 * Returns `null` when the user is not a member of that server.
 */
export const loadMemberContext = async ({
  serverId,
  userId
}: ResolveMemberPermissionsInput): Promise<MemberPermissionContext | null> => {
  const [member, defaultRole, server] = await Promise.all([
    prisma.serverMember.findUnique({
      where: { serverId_userId: { serverId, userId } },
      select: { id: true, roles: { select: { role: { select: { id: true, permissions: true } } } } }
    }),
    prisma.serverRole.findFirst({
      where: { serverId, isDefault: true },
      select: { id: true, permissions: true }
    }),
    prisma.server.findUnique({ where: { id: serverId }, select: { ownerId: true } })
  ]);

  if (isNullish(member) || isNullish(server)) {
    return null;
  }

  const assignedRoles = member.roles.map(({ role }) => role);
  const roles = isNullish(defaultRole) ? assignedRoles : [defaultRole, ...assignedRoles];

  const basePermissions = roles.reduce(
    (acc, role) => acc | role.permissions,
    roles.length > 0 ? 0n : DEFAULT_ROLE_PERMISSIONS
  );

  const isOwner = server.ownerId === userId;

  return {
    serverId,
    memberId: member.id,
    isOwner,
    basePermissions,
    roleIds: roles.map((role) => role.id),
    permissions: resolvePermissions({ basePermissions, isOwner })
  };
};

/**
 * The effective permission mask for one member in one channel, following the
 * Discord order: base roles, category overwrites, then channel overwrites.
 */
export const resolveChannelPermissions = async ({
  serverId,
  userId,
  channelId
}: Required<ResolveMemberPermissionsInput>) => {
  const [context, channel] = await Promise.all([
    loadMemberContext({ serverId, userId }),
    prisma.room.findUnique({
      where: { id: channelId },
      select: {
        categoryId: true,
        type: true,
        overwrites: { select: overwriteRowSelect }
      }
    })
  ]);

  if (isNullish(context) || isNullish(channel)) {
    return 0n;
  }

  const categoryOverwrites = isNullish(channel.categoryId)
    ? []
    : await prisma.channelOverwrite.findMany({
        where: { categoryId: channel.categoryId },
        select: overwriteRowSelect
      });

  const category = splitOverwrites({
    overwrites: categoryOverwrites,
    roleIds: context.roleIds,
    memberId: context.memberId
  });

  const own = splitOverwrites({
    overwrites: channel.overwrites,
    roleIds: context.roleIds,
    memberId: context.memberId
  });

  const resolved = resolvePermissions({
    basePermissions: context.basePermissions,
    categoryRoleOverwrites: category.roleOverwrites,
    categoryMemberOverwrite: category.memberOverwrite,
    channelRoleOverwrites: own.roleOverwrites,
    channelMemberOverwrite: own.memberOverwrite,
    isOwner: context.isOwner
  });

  return maskForChannelType(resolved, channel.type);
};

/**
 * Resolves every channel of a server in one pass — the sidebar needs the whole
 * tree, and doing it per channel would issue a query per row.
 */
export const resolveServerChannelPermissions = async ({
  serverId,
  userId
}: ResolveMemberPermissionsInput) => {
  const context = await loadMemberContext({ serverId, userId });

  if (isNullish(context)) {
    return { context: null, channelPermissions: new Map<string, bigint>() };
  }

  const [channels, overwrites] = await Promise.all([
    prisma.room.findMany({
      where: { serverId },
      select: { id: true, categoryId: true, type: true }
    }),
    prisma.channelOverwrite.findMany({
      where: { OR: [{ channel: { serverId } }, { category: { serverId } }] },
      select: { ...overwriteRowSelect, channelId: true, categoryId: true }
    })
  ]);

  const byChannel = new Map<string, OverwriteRow[]>();
  const byCategory = new Map<string, OverwriteRow[]>();

  overwrites.forEach((row) => {
    const bucket = isNullish(row.channelId) ? byCategory : byChannel;
    const key = row.channelId ?? row.categoryId;

    if (isNullish(key)) {
      return;
    }

    bucket.set(key, [...(bucket.get(key) ?? []), row]);
  });

  const channelPermissions = new Map<string, bigint>();

  channels.forEach((channel) => {
    const category = splitOverwrites({
      overwrites: isNullish(channel.categoryId) ? [] : (byCategory.get(channel.categoryId) ?? []),
      roleIds: context.roleIds,
      memberId: context.memberId
    });

    const own = splitOverwrites({
      overwrites: byChannel.get(channel.id) ?? [],
      roleIds: context.roleIds,
      memberId: context.memberId
    });

    const resolved = resolvePermissions({
      basePermissions: context.basePermissions,
      categoryRoleOverwrites: category.roleOverwrites,
      categoryMemberOverwrite: category.memberOverwrite,
      channelRoleOverwrites: own.roleOverwrites,
      channelMemberOverwrite: own.memberOverwrite,
      isOwner: context.isOwner
    });

    channelPermissions.set(channel.id, maskForChannelType(resolved, channel.type));
  });

  return { context, channelPermissions };
};

/** The highest role position a member holds — the hierarchy check for kick, ban and role edits. */
export const getMemberTopRolePosition = async ({
  serverId,
  userId
}: ResolveMemberPermissionsInput) => {
  const member = await prisma.serverMember.findUnique({
    where: { serverId_userId: { serverId, userId } },
    select: { roles: { select: { role: { select: { position: true } } } } }
  });

  if (isNullish(member)) {
    return -1;
  }

  const positions = sortBy(
    member.roles.map(({ role }) => role.position),
    (position) => -position
  );

  return positions.at(0) ?? 0;
};
