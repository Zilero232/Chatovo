import type { Prisma } from '../../../generated';

export const serverSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  iconUrl: true,
  bannerColor: true,
  ownerId: true,
  systemChannelId: true,
  createdAt: true,
  _count: { select: { members: true } }
} satisfies Prisma.ServerSelect;

export const serverRoleSelect = {
  id: true,
  serverId: true,
  name: true,
  color: true,
  position: true,
  permissions: true,
  isDefault: true,
  mentionable: true,
  hoist: true
} satisfies Prisma.ServerRoleSelect;

export const serverMemberSelect = {
  id: true,
  serverId: true,
  userId: true,
  nickname: true,
  role: true,
  mutedUntil: true,
  joinedAt: true,
  user: { select: { name: true, profile: { select: { displayName: true, avatarUrl: true } } } },
  roles: { select: { roleId: true } }
} satisfies Prisma.ServerMemberSelect;

export const serverInviteSelect = {
  id: true,
  code: true,
  serverId: true,
  creatorId: true,
  maxUses: true,
  uses: true,
  expiresAt: true,
  createdAt: true
} satisfies Prisma.ServerInviteSelect;

export const channelSelect = {
  id: true,
  serverId: true,
  categoryId: true,
  name: true,
  type: true,
  topic: true,
  position: true,
  slowMode: true,
  nsfw: true,
  userLimit: true,
  isPrivate: true,
  archivedAt: true
} satisfies Prisma.RoomSelect;

export const categorySelect = {
  id: true,
  serverId: true,
  name: true,
  position: true
} satisfies Prisma.CategorySelect;

export const overwriteSelect = {
  id: true,
  target: true,
  roleId: true,
  memberId: true,
  allow: true,
  deny: true
} satisfies Prisma.ChannelOverwriteSelect;

export const threadSelect = {
  id: true,
  channelId: true,
  name: true,
  creatorId: true,
  pinned: true,
  locked: true,
  archivedAt: true,
  messageCount: true,
  lastMessageAt: true,
  tags: { select: { tagId: true } }
} satisfies Prisma.ThreadSelect;

export const threadTagSelect = {
  id: true,
  channelId: true,
  name: true,
  emoji: true
} satisfies Prisma.ThreadTagSelect;
