import { z } from 'zod';
import { roomSchema } from '../rooms/outputs';

export const tokenRequestSchema = z.object({
  roomId: roomSchema.shape.id,
  password: z.string().min(1).max(128).optional(),
});

// Client tells the server its current mic state. LiveKit webhooks don't ship
// mute toggles (only track_published/unpublished), so this is the only path
// for live mic state to reach the presence cache.
export const micStateRequestSchema = z.object({
  roomId: roomSchema.shape.id,
  micMuted: z.boolean(),
});
