import { QUERY_KEYS } from '@/shared/constants';
import { appendChatLine, applyChatDeleteToLines, applyChatEditToLines } from './merge-chat-lines';
import { chatMessageToChatLine } from './to-chat-line';
import type { RealtimeServerMessage } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';
import type { ChatLine } from '../types';

export const applyChatRealtimeMessage = (
  queryClient: QueryClient,
  message: RealtimeServerMessage,
): void => {
  if (message.type === 'chat.message') {
    const line = chatMessageToChatLine(message.message);
    const queryKey = QUERY_KEYS.chatMessages(message.roomId);

    queryClient.setQueryData<ChatLine[]>(queryKey, (prev) => appendChatLine(prev, line));

    return;
  }

  if (message.type === 'chat.edit') {
    const queryKey = QUERY_KEYS.chatMessages(message.roomId);
    const editedAt = new Date(message.editedAt).getTime();

    queryClient.setQueryData<ChatLine[]>(queryKey, (prev) =>
      prev ? applyChatEditToLines(prev, message.id, message.body, editedAt) : prev,
    );

    return;
  }

  if (message.type === 'chat.delete') {
    const queryKey = QUERY_KEYS.chatMessages(message.roomId);
    const deletedAt = new Date(message.deletedAt).getTime();

    queryClient.setQueryData<ChatLine[]>(queryKey, (prev) =>
      prev ? applyChatDeleteToLines(prev, message.id, deletedAt) : prev,
    );
  }
};
