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

type WithoutRoomRouting<T> = T extends unknown ? Omit<T, 'roomId' | 'roomKind'> : never;

export type ChatRealtimeEventInput = WithoutRoomRouting<ChatRealtimeEvent>;
