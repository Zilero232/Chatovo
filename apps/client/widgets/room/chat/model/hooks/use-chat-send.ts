'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { sendChatMessage } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { useRoomChat } from '../contexts';
import { chatMessageToChatLine } from '../lib';
import type { ChatLine } from '../types';

export const useChatSend = (roomId: string) => {
  const t = useTranslations('chat');

  const queryClient = useQueryClient();
  const { send } = useRoomChat();

  const queryKey = QUERY_KEYS.chatMessages(roomId);

  const sendAndPersist = async (body: string) => {
    const sent = await send(body);

    try {
      const saved = await sendChatMessage(sent.id, roomId, body);
      const line = chatMessageToChatLine(saved);

      queryClient.setQueryData<ChatLine[]>(queryKey, (prev) => {
        if (!prev) {
          return [line];
        }

        if (prev.some((item) => item.id === line.id)) {
          return prev;
        }

        return [...prev, line];
      });
    } catch (error) {
      console.error(error);

      toast.error(t('persistFailed'));
    }
  };

  return { sendAndPersist };
};
