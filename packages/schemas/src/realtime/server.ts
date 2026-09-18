import { z } from 'zod';

import {
  categorySchema,
  channelReadStateSchema,
  channelSchema,
  threadSchema
} from '../channels/outputs';
import { chatMessageSchema, chatReactionSchema } from '../chat/outputs';
import { friendCallStreamSnapshotSchema } from '../friends/outputs';
import { roomsParticipantsSnapshotSchema } from '../livekit/outputs';
import { roomSchema } from '../rooms/outputs';
import { serverMemberSchema, serverRoleSchema, serverSchema } from '../servers/outputs';
import { soundboardSoundSchema } from './soundboard';

export const realtimeRoomKindSchema = roomSchema.shape.kind;

export const realtimeChatMessageEventSchema = z.object({
  type: z.literal('chat.message'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  serverId: z.uuid().nullable().optional(),
  message: chatMessageSchema
});

export const realtimeChatEditEventSchema = z.object({
  type: z.literal('chat.edit'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  serverId: z.uuid().nullable().optional(),
  threadId: z.uuid().nullable().optional(),
  id: z.uuid(),
  body: z.string(),
  editedAt: z.string()
});

export const realtimeChatDeleteEventSchema = z.object({
  type: z.literal('chat.delete'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  serverId: z.uuid().nullable().optional(),
  threadId: z.uuid().nullable().optional(),
  id: z.uuid(),
  deletedAt: z.string()
});

export const realtimeChatReactionEventSchema = z.object({
  type: z.literal('chat.reaction'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  serverId: z.uuid().nullable().optional(),
  threadId: z.uuid().nullable().optional(),
  id: z.uuid(),
  reactions: z.array(chatReactionSchema)
});

export const realtimeRoomReactionEventSchema = z.object({
  type: z.literal('room.reaction'),
  roomId: roomSchema.shape.id,
  emoji: z.string(),
  senderId: z.string()
});

export const realtimeRoomSoundboardEventSchema = z.object({
  type: z.literal('room.soundboard'),
  roomId: roomSchema.shape.id,
  sound: soundboardSoundSchema,
  senderId: z.string()
});

export const realtimePresenceSnapshotEventSchema = z.object({
  type: z.literal('presence.snapshot'),
  snapshot: roomsParticipantsSnapshotSchema
});

export const realtimeFriendsSnapshotEventSchema = z.object({
  type: z.literal('friends.snapshot'),
  snapshot: friendCallStreamSnapshotSchema
});

export const realtimeFriendPresenceEventSchema = z.object({
  type: z.literal('friend.presence'),
  userId: z.string(),
  isOnline: z.boolean()
});

export const realtimeChannelCreateEventSchema = z.object({
  type: z.literal('channel.create'),
  serverId: serverSchema.shape.id,
  channel: channelSchema
});

export const realtimeChannelUpdateEventSchema = z.object({
  type: z.literal('channel.update'),
  serverId: serverSchema.shape.id,
  channel: channelSchema
});

export const realtimeChannelDeleteEventSchema = z.object({
  type: z.literal('channel.delete'),
  serverId: serverSchema.shape.id,
  channelId: channelSchema.shape.id
});

export const realtimeChannelReorderEventSchema = z.object({
  type: z.literal('channel.reorder'),
  serverId: serverSchema.shape.id,
  channels: z.array(channelSchema),
  categories: z.array(categorySchema)
});

export const realtimeCategoryCreateEventSchema = z.object({
  type: z.literal('category.create'),
  serverId: serverSchema.shape.id,
  category: categorySchema
});

export const realtimeCategoryUpdateEventSchema = z.object({
  type: z.literal('category.update'),
  serverId: serverSchema.shape.id,
  category: categorySchema
});

export const realtimeCategoryDeleteEventSchema = z.object({
  type: z.literal('category.delete'),
  serverId: serverSchema.shape.id,
  categoryId: categorySchema.shape.id
});

export const realtimeServerUpdateEventSchema = z.object({
  type: z.literal('server.update'),
  server: serverSchema
});

export const realtimeServerDeleteEventSchema = z.object({
  type: z.literal('server.delete'),
  serverId: serverSchema.shape.id
});

export const realtimeMemberJoinEventSchema = z.object({
  type: z.literal('member.join'),
  serverId: serverSchema.shape.id,
  member: serverMemberSchema
});

export const realtimeMemberUpdateEventSchema = z.object({
  type: z.literal('member.update'),
  serverId: serverSchema.shape.id,
  member: serverMemberSchema
});

export const realtimeMemberLeaveEventSchema = z.object({
  type: z.literal('member.leave'),
  serverId: serverSchema.shape.id,
  userId: z.string()
});

export const realtimeRoleUpsertEventSchema = z.object({
  type: z.literal('role.upsert'),
  serverId: serverSchema.shape.id,
  role: serverRoleSchema
});

export const realtimeRoleDeleteEventSchema = z.object({
  type: z.literal('role.delete'),
  serverId: serverSchema.shape.id,
  roleId: serverRoleSchema.shape.id
});

/** The viewer's own permissions changed here — the client refetches its tree. */
export const realtimePermissionsUpdateEventSchema = z.object({
  type: z.literal('permissions.update'),
  serverId: serverSchema.shape.id
});

export const realtimeThreadUpsertEventSchema = z.object({
  type: z.literal('thread.upsert'),
  channelId: channelSchema.shape.id,
  thread: threadSchema
});

export const realtimeThreadDeleteEventSchema = z.object({
  type: z.literal('thread.delete'),
  channelId: channelSchema.shape.id,
  threadId: threadSchema.shape.id
});

export const realtimeReadStateEventSchema = z.object({
  type: z.literal('read.state'),
  state: channelReadStateSchema
});

export const realtimeTypingEventSchema = z.object({
  type: z.literal('channel.typing'),
  channelId: channelSchema.shape.id,
  threadId: threadSchema.shape.id.nullable(),
  userId: z.string(),
  expiresAt: z.string()
});

export const realtimeServerMessageSchema = z.discriminatedUnion('type', [
  realtimeChatMessageEventSchema,
  realtimeChatEditEventSchema,
  realtimeChatDeleteEventSchema,
  realtimeChatReactionEventSchema,
  realtimeRoomReactionEventSchema,
  realtimeRoomSoundboardEventSchema,
  realtimePresenceSnapshotEventSchema,
  realtimeFriendsSnapshotEventSchema,
  realtimeFriendPresenceEventSchema,
  realtimeChannelCreateEventSchema,
  realtimeChannelUpdateEventSchema,
  realtimeChannelDeleteEventSchema,
  realtimeChannelReorderEventSchema,
  realtimeCategoryCreateEventSchema,
  realtimeCategoryUpdateEventSchema,
  realtimeCategoryDeleteEventSchema,
  realtimeServerUpdateEventSchema,
  realtimeServerDeleteEventSchema,
  realtimeMemberJoinEventSchema,
  realtimeMemberUpdateEventSchema,
  realtimeMemberLeaveEventSchema,
  realtimeRoleUpsertEventSchema,
  realtimeRoleDeleteEventSchema,
  realtimePermissionsUpdateEventSchema,
  realtimeThreadUpsertEventSchema,
  realtimeThreadDeleteEventSchema,
  realtimeReadStateEventSchema,
  realtimeTypingEventSchema
]);
