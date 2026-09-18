import type { z } from 'zod';

import type { roomKindSchema, roomSchema } from './outputs';

export type Room = z.infer<typeof roomSchema>;
export type RoomKind = z.infer<typeof roomKindSchema>;
