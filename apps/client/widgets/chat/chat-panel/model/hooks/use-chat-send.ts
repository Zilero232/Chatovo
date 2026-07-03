'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { sendChatMessage } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { chatMessageToChatLine } from '../lib';
import { appendChatLine } from '../lib/merge-chat-lines';
import type { ChatLine } from '../types';

export const useChatSend = (roomId: string) => {
  const t = useTranslations('chat');
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.chatMessages(roomId);

  return useMutation({
    mutationFn: async (body: string) => {
      const id = crypto.randomUUID();

      return sendChatMessage(id, roomId, body);
    },
    onSuccess: (saved) => {
      const line = chatMessageToChatLine(saved);

      queryClient.setQueryData<ChatLine[]>(queryKey, (prev) => appendChatLine(prev, line));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t('persistFailed'));
    },
  });
};
