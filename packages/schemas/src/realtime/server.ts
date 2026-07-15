import { z } from 'zod';

import { chatMessageSchema } from '../chat/outputs';
import { friendCallStreamSnapshotSchema } from '../friends/outputs';
import { roomsParticipantsSnapshotSchema } from '../livekit/outputs';
import { roomSchema } from '../rooms/outputs';

export const realtimeRoomKindSchema = roomSchema.shape.kind;

export const realtimeChatMessageEventSchema = z.object({
  type: z.literal('chat.message'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  message: chatMessageSchema,
});

export const realtimeChatEditEventSchema = z.object({
  type: z.literal('chat.edit'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  id: z.uuid(),
  body: z.string(),
  editedAt: z.string(),
});

export const realtimeChatDeleteEventSchema = z.object({
  type: z.literal('chat.delete'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  id: z.uuid(),
  deletedAt: z.string(),
});

export const realtimeRoomReactionEventSchema = z.object({
  type: z.literal('room.reaction'),
  roomId: roomSchema.shape.id,
  emoji: z.string(),
  senderId: z.string(),
});

export const realtimePresenceSnapshotEventSchema = z.object({
  type: z.literal('presence.snapshot'),
  snapshot: roomsParticipantsSnapshotSchema,
});

export const realtimeFriendsSnapshotEventSchema = z.object({
  type: z.literal('friends.snapshot'),
  snapshot: friendCallStreamSnapshotSchema,
});

export const realtimeFriendPresenceEventSchema = z.object({
  type: z.literal('friend.presence'),
  userId: z.string(),
  isOnline: z.boolean(),
});

export const realtimeServerMessageSchema = z.discriminatedUnion('type', [
  realtimeChatMessageEventSchema,
  realtimeChatEditEventSchema,
  realtimeChatDeleteEventSchema,
  realtimeRoomReactionEventSchema,
  realtimePresenceSnapshotEventSchema,
  realtimeFriendsSnapshotEventSchema,
  realtimeFriendPresenceEventSchema,
]);
