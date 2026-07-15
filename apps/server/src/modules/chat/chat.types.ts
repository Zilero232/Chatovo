import type { ChatMessage, RealtimeServerMessage } from '@chatovo/schemas';

export type UploadedAttachment = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type ChatRealtimeEvent = Extract<
  RealtimeServerMessage,
  { type: 'chat.message' } | { type: 'chat.edit' } | { type: 'chat.delete' }
>;

export type ChatRealtimeEventInput =
  | { type: 'chat.message'; message: ChatMessage }
  | { type: 'chat.edit'; id: string; body: string; editedAt: string }
  | { type: 'chat.delete'; id: string; deletedAt: string };
