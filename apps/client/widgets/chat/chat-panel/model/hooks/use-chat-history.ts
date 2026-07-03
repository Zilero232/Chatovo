'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchChatMessages } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { chatMessageToChatLine, mergeChatHistory } from '../lib';

export const useChatHistory = (roomId: string) => {
  const queryClient = useQueryClient();

  const { data, isPending, isFetching } = useQuery({
    queryKey: QUERY_KEYS.chatMessages(roomId),
    enabled: roomId.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      const page = await fetchChatMessages(roomId);
      const fetched = page.items.map(chatMessageToChatLine);

      return mergeChatHistory(queryClient, roomId, fetched);
    },
  });

  const messages = data ?? [];
  const isLoading = isPending && isFetching && messages.length === 0;

  return { messages, isPending: isLoading };
};
