import { z } from 'zod';

export const sendMessageInputSchema = z.object({
  id: z.string().min(1).max(64),
  roomId: z.uuid(),
  body: z.string().min(1).max(4000),
});

export const listMessagesQuerySchema = z.object({
  roomId: z.uuid(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const editMessageInputSchema = z.object({
  body: z.string().min(1).max(4000),
});

export const messageIdParamSchema = z.object({
  id: z.uuid(),
});
