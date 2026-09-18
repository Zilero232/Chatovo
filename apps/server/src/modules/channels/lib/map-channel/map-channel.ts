import { serializePermissions } from '@chatovo/schemas';

import type {
  CategoryRow,
  ChannelReadRow,
  ChannelRow,
  OverwriteRow,
  ThreadRow,
  ThreadTagRow
} from './map-channel.types';

export const mapChannel = (row: ChannelRow) => ({
  id: row.id,
  serverId: row.serverId,
  categoryId: row.categoryId,
  name: row.name,
  type: row.type,
  topic: row.topic,
  position: row.position,
  slowMode: row.slowMode,
  nsfw: row.nsfw,
  userLimit: row.userLimit,
  isPrivate: row.isPrivate,
  archivedAt: row.archivedAt?.toISOString() ?? null
});

export const mapCategory = (row: CategoryRow) => ({
  id: row.id,
  serverId: row.serverId,
  name: row.name,
  position: row.position
});

export const mapOverwrite = (row: OverwriteRow) => ({
  id: row.id,
  target: row.target,
  roleId: row.roleId,
  memberId: row.memberId,
  allow: serializePermissions(row.allow),
  deny: serializePermissions(row.deny)
});

export const mapThread = (row: ThreadRow) => ({
  id: row.id,
  channelId: row.channelId,
  name: row.name,
  creatorId: row.creatorId,
  pinned: row.pinned,
  locked: row.locked,
  archivedAt: row.archivedAt?.toISOString() ?? null,
  messageCount: row.messageCount,
  lastMessageAt: row.lastMessageAt.toISOString(),
  tagIds: row.tags.map(({ tagId }) => tagId)
});

export const mapThreadTag = (row: ThreadTagRow) => ({
  id: row.id,
  channelId: row.channelId,
  name: row.name,
  emoji: row.emoji
});

export const mapReadState = (row: ChannelReadRow, lastMessageAt: Date | null) => ({
  channelId: row.channelId,
  lastReadAt: row.lastReadAt.toISOString(),
  mentionCount: row.mentionCount,
  mutedUntil: row.mutedUntil?.toISOString() ?? null,
  hasUnread: lastMessageAt !== null && lastMessageAt > row.lastReadAt
});
