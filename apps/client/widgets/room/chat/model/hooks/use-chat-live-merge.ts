'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/shared/constants';
import { useRoomChat } from '../contexts';
import { liveMessageToChatLine } from '../lib';
import type { ChatLine } from '../types';

export const useChatLiveMerge = (roomId: string) => {
  const queryClient = useQueryClient();
  const { chatMessages } = useRoomChat();

  const queryKey = QUERY_KEYS.chatMessages(roomId);

  useEffect(() => {
    if (chatMessages.length === 0) {
      return;
    }

    queryClient.setQueryData<ChatLine[]>(queryKey, (prev) => {
      const existing = prev ?? [];
      const known = new Set(existing.map((line) => line.id));

      const incoming = chatMessages
        .map(liveMessageToChatLine)
        .filter((line) => !known.has(line.id));

      if (incoming.length === 0) {
        return prev;
      }

      return [...existing, ...incoming];
    });
  }, [chatMessages, queryClient, queryKey]);
};
