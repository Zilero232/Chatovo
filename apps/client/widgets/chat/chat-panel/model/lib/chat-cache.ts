import { match } from 'ts-pattern';
import { QUERY_KEYS } from '@/shared/constants';
import { appEvents } from '@/shared/lib';
import {
  appendChatLine,
  applyChatDeleteToLines,
  applyChatEditToLines,
  mergeChatLines,
} from './merge-chat-lines';
import { chatMessageToChatLine } from './to-chat-line';
import type { ChatMessage, RealtimeServerMessage } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';
import type { ChatLine } from '../types';

const chatKey = (roomId: string) => {
  return QUERY_KEYS.chatMessages(roomId);
};

export const readChatLines = (queryClient: QueryClient, roomId: string): ChatLine[] | undefined => {
  return queryClient.getQueryData<ChatLine[]>(chatKey(roomId));
};

export const patchChatLines = (
  queryClient: QueryClient,
  roomId: string,
  updater: (lines: ChatLine[] | undefined) => ChatLine[] | undefined,
): void => {
  queryClient.setQueryData<ChatLine[]>(chatKey(roomId), updater);
};

export const appendChatMessage = (
  queryClient: QueryClient,
  roomId: string,
  line: ChatLine,
): void => {
  patchChatLines(queryClient, roomId, (lines) => appendChatLine(lines, line));
};

export const appendChatDto = (
  queryClient: QueryClient,
  roomId: string,
  message: ChatMessage,
): void => {
  appendChatMessage(queryClient, roomId, chatMessageToChatLine(message));
};

export const editChatMessageInCache = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  body: string,
  editedAt: number,
): void => {
  patchChatLines(queryClient, roomId, (lines) =>
    lines ? applyChatEditToLines(lines, id, body, editedAt) : lines,
  );
};

export const deleteChatMessageInCache = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  deletedAt: number,
): void => {
  patchChatLines(queryClient, roomId, (lines) =>
    lines ? applyChatDeleteToLines(lines, id, deletedAt) : lines,
  );
};

export const mergeChatHistory = (
  queryClient: QueryClient,
  roomId: string,
  fetched: ChatLine[],
): ChatLine[] => {
  const cached = readChatLines(queryClient, roomId);

  if (!cached?.length) {
    return fetched;
  }

  return mergeChatLines(cached, fetched);
};

export const applyChatRealtime = (
  queryClient: QueryClient,
  message: RealtimeServerMessage,
): void => {
  match(message)
    .with({ type: 'chat.message' }, ({ roomId, roomKind, message: dto }) => {
      appendChatDto(queryClient, roomId, dto);
      appEvents.emit.chatMessage({ roomId, senderId: dto.senderId, roomKind });
    })
    .with({ type: 'chat.edit' }, ({ roomId, id, body, editedAt }) => {
      editChatMessageInCache(queryClient, roomId, id, body, new Date(editedAt).getTime());
    })
    .with({ type: 'chat.delete' }, ({ roomId, id, deletedAt }) => {
      deleteChatMessageInCache(queryClient, roomId, id, new Date(deletedAt).getTime());
    })
    .otherwise(() => {});
};
