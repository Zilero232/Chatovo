import { z } from 'zod';

import { roomSchema } from '../rooms/outputs';
import { soundboardSoundSchema } from './soundboard';

export const realtimeSubscribeSchema = z.object({
  op: z.literal('subscribe'),
  rooms: z.array(roomSchema.shape.id)
});

export const realtimePresencePatchSchema = z.object({
  op: z.literal('presence.patch'),
  roomId: roomSchema.shape.id,
  micMuted: z.boolean().optional(),
  deafened: z.boolean().optional(),
  activity: z.string().max(64).nullable().optional()
});

export const realtimeRoomReactionSchema = z.object({
  op: z.literal('room.reaction'),
  roomId: roomSchema.shape.id,
  emoji: z.string().min(1).max(16)
});

export const realtimeRoomSoundboardSchema = z.object({
  op: z.literal('room.soundboard'),
  roomId: roomSchema.shape.id,
  sound: soundboardSoundSchema
});

export const realtimeClientMessageSchema = z.discriminatedUnion('op', [
  realtimeSubscribeSchema,
  realtimePresencePatchSchema,
  realtimeRoomReactionSchema,
  realtimeRoomSoundboardSchema
]);
