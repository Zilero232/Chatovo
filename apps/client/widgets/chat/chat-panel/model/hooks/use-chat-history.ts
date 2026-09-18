'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { fetchChatMessages } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { chatMessageToChatLine, mergeChatHistory } from '../lib';

export const useChatHistory = (roomId: string, threadId?: string | null) => {
  const queryClient = useQueryClient();

  const queryKey = threadId
    ? QUERY_KEYS.chatThreadMessages(roomId, threadId)
    : QUERY_KEYS.chatMessages(roomId);

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey,
    enabled: roomId.length > 0,
    staleTime: secondsToMilliseconds(30),
    queryFn: async () => {
      const page = await fetchChatMessages(roomId, undefined, 50, threadId);
      const fetched = page.items.map(chatMessageToChatLine);

      return mergeChatHistory(queryClient, roomId, fetched, threadId);
    }
  });

  const messages = data ?? [];
  const isLoading = isPending && isFetching && messages.length === 0;

  return { messages, isPending: isLoading, isError, refetch };
};
