import type { z } from 'zod';
import type {
  editMessageInputSchema,
  listMessagesQuerySchema,
  messageIdParamSchema,
  sendMessageInputSchema,
} from './inputs';
import type { chatAttachmentSchema, chatMessageSchema, chatMessagesPageSchema } from './outputs';

export type ChatAttachment = z.infer<typeof chatAttachmentSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatMessagesPage = z.infer<typeof chatMessagesPageSchema>;

export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;
export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>;
export type EditMessageInput = z.infer<typeof editMessageInputSchema>;
export type MessageIdParam = z.infer<typeof messageIdParamSchema>;
