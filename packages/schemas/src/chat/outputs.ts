import { z } from 'zod';

export const chatAttachmentSchema = z.object({
  kind: z.literal('attachment'),
  url: z.url(),
  name: z.string().min(1).max(255),
  size: z.number().int().nonnegative(),
  mime: z.string().min(1).max(255)
});

export const chatReactionSchema = z.object({
  emoji: z.string(),
  count: z.number().int().nonnegative(),
  userIds: z.array(z.string())
});

export const chatMessageSchema = z.object({
  id: z.uuid(),
  roomId: z.uuid(),
  threadId: z.uuid().nullable(),
  replyToId: z.uuid().nullable(),
  pinned: z.boolean(),
  reactions: z.array(chatReactionSchema).default([]),
  mentions: z.array(z.string()).default([]),
  mentionsEveryone: z.boolean().default(false),
  senderId: z.string().nullable(),
  senderName: z.string(),
  body: z.string(),
  createdAt: z.string(),
  editedAt: z.string().nullable(),
  deletedAt: z.string().nullable()
});

export const chatMessagesPageSchema = z.object({
  items: z.array(chatMessageSchema),
  nextCursor: z.string().nullable()
});
