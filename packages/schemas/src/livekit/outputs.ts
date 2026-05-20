import { z } from 'zod';

export const tokenResponseSchema = z.object({
  token: z.string(),
});

export const roomParticipantSchema = z.object({
  identity: z.string(),
  name: z.string(),
});

export const roomParticipantsResponseSchema = z.object({
  participants: z.array(roomParticipantSchema),
});
