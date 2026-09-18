import { z } from 'zod';

export const sendMessageInputSchema = z.object({
  id: z.string().min(1).max(64),
  roomId: z.uuid(),
  threadId: z.uuid().nullable().optional(),
  replyToId: z.uuid().nullable().optional(),
  body: z.string().min(1).max(4000)
});

export const listMessagesQuerySchema = z.object({
  roomId: z.uuid(),
  threadId: z.uuid().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50)
});

export const pinMessageInputSchema = z.object({ pinned: z.boolean() });

export const reactMessageInputSchema = z.object({ emoji: z.string().trim().min(1).max(32) });

export const editMessageInputSchema = z.object({
  body: z.string().min(1).max(4000)
});

export const messageIdParamSchema = z.object({
  id: z.uuid()
});
