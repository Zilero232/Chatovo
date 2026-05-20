import type { z } from 'zod';

import type { tokenRequestSchema } from './inputs';
import type {
  roomParticipantSchema,
  roomParticipantsResponseSchema,
  tokenResponseSchema,
} from './outputs';

export type TokenRequest = z.infer<typeof tokenRequestSchema>;
export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type RoomParticipant = z.infer<typeof roomParticipantSchema>;
export type RoomParticipantsResponse = z.infer<typeof roomParticipantsResponseSchema>;
