'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchChatMessages } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { chatMessageToChatLine, mergeChatLines } from '../lib';
import type { ChatLine } from '../types';

export const useChatHistory = (roomId: string) => {
  const queryClient = useQueryClient();

  const { data, isPending, isFetching } = useQuery({
    queryKey: QUERY_KEYS.chatMessages(roomId),
    enabled: roomId.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async (): Promise<ChatLine[]> => {
      const page = await fetchChatMessages(roomId);
      const fetched = page.items.map(chatMessageToChatLine);
      const cached = queryClient.getQueryData<ChatLine[]>(QUERY_KEYS.chatMessages(roomId));

      if (!cached?.length) {
        return fetched;
      }

      return mergeChatLines(cached, fetched);
    },
  });

  const messages = data ?? [];
  const isLoading = isPending && isFetching && messages.length === 0;

  return { messages, isPending: isLoading };
};
