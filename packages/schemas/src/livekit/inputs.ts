import { z } from 'zod';
import { roomSchema } from '../rooms/outputs';

export const tokenRequestSchema = z.object({
  roomId: roomSchema.shape.id,
  password: z.string().min(1).max(128).optional(),
});
