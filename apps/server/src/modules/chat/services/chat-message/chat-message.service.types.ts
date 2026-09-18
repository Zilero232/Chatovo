import type { EditMessageInput, ListMessagesQuery, SendMessageInput } from '@chatovo/schemas';

export type SendChatMessageInput = {
  input: SendMessageInput;
  senderId: string;
};

export type ListChatMessagesInput = {
  query: ListMessagesQuery;
  userId: string;
};

export type GetOwnMessageInput = {
  messageId: string;
  senderId: string;
};

export type EditChatMessageInput = {
  messageId: string;
  input: EditMessageInput;
  senderId: string;
};

export type DeleteChatMessageInput = {
  messageId: string;
  senderId: string;
};

export type ModerateMessageInput = {
  messageId: string;
  userId: string;
};

export type PinChatMessageInput = {
  messageId: string;
  pinned: boolean;
  userId: string;
};

export type ListPinnedMessagesInput = {
  roomId: string;
  userId: string;
};

export type ReactChatMessageInput = {
  emoji: string;
  messageId: string;
  userId: string;
};
