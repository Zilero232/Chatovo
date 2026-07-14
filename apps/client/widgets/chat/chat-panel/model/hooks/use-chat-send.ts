'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { sendChatMessage } from '@/shared/api';
import { appendChatDto } from '../lib';

export const useChatSend = (roomId: string) => {
  const t = useTranslations('chat');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: string) => {
      const id = crypto.randomUUID();

      return sendChatMessage(id, roomId, body);
    },
    onSuccess: (saved) => {
      appendChatDto(queryClient, roomId, saved);
    },
    onError: () => {
      toast.error(t('persistFailed'));
    },
  });
};
