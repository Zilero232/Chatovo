import type { RealtimeServerMessage } from '@chatovo/schemas';

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

export type ChatRealtimeEventInput = ChatRealtimeEvent extends infer Event
  ? Event extends ChatRealtimeEvent
    ? Omit<Event, 'roomId' | 'roomKind'>
    : never
  : never;
