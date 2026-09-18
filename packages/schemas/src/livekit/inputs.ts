import { z } from 'zod';

import { roomSchema } from '../rooms/outputs';

export const tokenRequestSchema = z.object({
  roomId: roomSchema.shape.id,
  invisible: z.boolean().optional()
});
