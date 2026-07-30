import type { ChatMessage, RealtimeServerMessage } from '@chatovo/schemas';

export type UploadedAttachment = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

export type ChatRealtimeEvent = Extract<
  RealtimeServerMessage,
  { type: 'chat.delete' } | { type: 'chat.edit' } | { type: 'chat.message' }
>;

export type ChatRealtimeEventInput =
  | { type: 'chat.delete'; id: string; deletedAt: string }
  | { type: 'chat.edit'; id: string; body: string; editedAt: string }
  | { type: 'chat.message'; message: ChatMessage };
