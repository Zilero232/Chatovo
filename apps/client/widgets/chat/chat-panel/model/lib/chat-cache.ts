import type { ChatMessage, RealtimeServerMessage } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

import { match } from 'ts-pattern';

import { QUERY_KEYS } from '@/shared/constants';
import { appEvents } from '@/shared/lib';

import type { ChatLine, ChatLineStatus } from '../types';

import {
  appendChatLine,
  applyChatDeleteToLines,
  applyChatEditToLines,
  applyChatStatusToLines,
  mergeChatLines,
  removeChatLine
} from './merge-chat-lines';
import { chatMessageToChatLine } from './to-chat-line';

type ThreadId = string | null | undefined;

const chatKey = (roomId: string, threadId?: ThreadId) =>
  threadId ? QUERY_KEYS.chatThreadMessages(roomId, threadId) : QUERY_KEYS.chatMessages(roomId);

export const readChatLines = (
  queryClient: QueryClient,
  roomId: string,
  threadId?: ThreadId
): ChatLine[] | undefined => queryClient.getQueryData<ChatLine[]>(chatKey(roomId, threadId));

export const patchChatLines = (
  queryClient: QueryClient,
  roomId: string,
  updater: (lines: ChatLine[] | undefined) => ChatLine[] | undefined,
  threadId?: ThreadId
): void => {
  queryClient.setQueryData<ChatLine[]>(chatKey(roomId, threadId), updater);
};

export const appendChatMessage = (
  queryClient: QueryClient,
  roomId: string,
  line: ChatLine,
  threadId?: ThreadId
): void => {
  patchChatLines(queryClient, roomId, (lines) => appendChatLine(lines, line), threadId);
};

export const appendChatDto = (
  queryClient: QueryClient,
  roomId: string,
  message: ChatMessage
): void => {
  appendChatMessage(
    queryClient,
    roomId,
    { ...chatMessageToChatLine(message), status: undefined },
    message.threadId
  );
};

export const markChatLineStatus = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  status: ChatLineStatus,
  threadId?: ThreadId
): void => {
  patchChatLines(
    queryClient,
    roomId,
    (lines) => (lines ? applyChatStatusToLines(lines, id, status) : lines),
    threadId
  );
};

export const dropChatLine = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  threadId?: ThreadId
): void => {
  patchChatLines(
    queryClient,
    roomId,
    (lines) => (lines ? removeChatLine(lines, id) : lines),
    threadId
  );
};

export const editChatMessageInCache = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  body: string,
  editedAt: number,
  threadId?: ThreadId
): void => {
  patchChatLines(
    queryClient,
    roomId,
    (lines) => (lines ? applyChatEditToLines(lines, id, body, editedAt) : lines),
    threadId
  );
};

export const deleteChatMessageInCache = (
  queryClient: QueryClient,
  roomId: string,
  id: string,
  deletedAt: number,
  threadId?: ThreadId
): void => {
  patchChatLines(
    queryClient,
    roomId,
    (lines) => (lines ? applyChatDeleteToLines(lines, id, deletedAt) : lines),
    threadId
  );
};

export const mergeChatHistory = (
  queryClient: QueryClient,
  roomId: string,
  fetched: ChatLine[],
  threadId?: ThreadId
): ChatLine[] => {
  const cached = readChatLines(queryClient, roomId, threadId);

  if (!cached?.length) {
    return fetched;
  }

  return mergeChatLines(cached, fetched);
};

export const applyChatRealtime = (
  queryClient: QueryClient,
  message: RealtimeServerMessage
): void => {
  match(message)
    .with({ type: 'chat.message' }, ({ roomId, roomKind, message: dto }) => {
      appendChatDto(queryClient, roomId, dto);
      appEvents.emit.chatMessage({ roomId, senderId: dto.senderId, roomKind });
    })
    .with({ type: 'chat.edit' }, ({ roomId, threadId, id, body, editedAt }) => {
      editChatMessageInCache(queryClient, roomId, id, body, new Date(editedAt).getTime(), threadId);
    })
    .with({ type: 'chat.delete' }, ({ roomId, threadId, id, deletedAt }) => {
      deleteChatMessageInCache(queryClient, roomId, id, new Date(deletedAt).getTime(), threadId);
    })
    .otherwise(() => {});
};
