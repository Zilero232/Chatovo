import { serializePermissions } from '@chatovo/schemas';

import type {
  ServerBanRow,
  ServerInviteRow,
  ServerMemberRow,
  ServerRoleRow,
  ServerRow
} from './map-server.types';

export const mapServer = (row: ServerRow) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  iconUrl: row.iconUrl,
  bannerColor: row.bannerColor,
  ownerId: row.ownerId,
  systemChannelId: row.systemChannelId,
  memberCount: row._count.members,
  createdAt: row.createdAt.toISOString()
});

export const mapRole = (row: ServerRoleRow) => ({
  id: row.id,
  serverId: row.serverId,
  name: row.name,
  color: row.color,
  position: row.position,
  permissions: serializePermissions(row.permissions),
  isDefault: row.isDefault,
  mentionable: row.mentionable,
  hoist: row.hoist
});

export const mapMember = (row: ServerMemberRow) => ({
  id: row.id,
  serverId: row.serverId,
  userId: row.userId,
  displayName: row.user.profile?.displayName ?? row.user.name,
  nickname: row.nickname,
  avatarUrl: row.user.profile?.avatarUrl ?? null,
  role: row.role,
  roleIds: row.roles.map(({ roleId }) => roleId),
  mutedUntil: row.mutedUntil?.toISOString() ?? null,
  joinedAt: row.joinedAt.toISOString()
});

export const mapInvite = (row: ServerInviteRow) => ({
  id: row.id,
  code: row.code,
  serverId: row.serverId,
  creatorId: row.creatorId,
  maxUses: row.maxUses,
  uses: row.uses,
  expiresAt: row.expiresAt?.toISOString() ?? null,
  createdAt: row.createdAt.toISOString()
});

export const mapBan = (row: ServerBanRow) => ({
  id: row.id,
  serverId: row.serverId,
  userId: row.userId,
  displayName: row.user.profile?.displayName ?? row.user.name,
  avatarUrl: row.user.profile?.avatarUrl ?? null,
  reason: row.reason,
  bannedById: row.bannedById,
  createdAt: row.createdAt.toISOString()
});
