import type { z } from 'zod';
import type { createRoomInputSchema, updateRoomInputSchema } from './inputs';
import type { roomSchema } from './outputs';

export type Room = z.infer<typeof roomSchema>;

export type CreateRoomRequest = z.infer<typeof createRoomInputSchema>;
export type UpdateRoomRequest = z.infer<typeof updateRoomInputSchema>;
