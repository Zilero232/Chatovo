'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { deleteChatMessage, editChatMessage } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { deleteChatMessageInCache, editChatMessageInCache } from '../lib';

export const useChatSync = (roomId: string) => {
  const t = useTranslations('chat');
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.chatMessages(roomId);

  const edit = async (id: string, body: string) => {
    const editedAt = Date.now();

    editChatMessageInCache(queryClient, roomId, id, body, editedAt);

    try {
      await editChatMessage(id, body);
    } catch {
      await queryClient.invalidateQueries({ queryKey });
      toast.error(t('editFailed'));
    }
  };

  const remove = async (id: string) => {
    const deletedAt = Date.now();

    deleteChatMessageInCache(queryClient, roomId, id, deletedAt);

    try {
      await deleteChatMessage(id);
    } catch {
      await queryClient.invalidateQueries({ queryKey });
      toast.error(t('deleteFailed'));
    }
  };

  return { edit, remove };
};
