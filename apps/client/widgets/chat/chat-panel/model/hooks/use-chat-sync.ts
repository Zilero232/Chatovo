'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { deleteChatMessage, editChatMessage } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { ChatLine } from '../types';

const applyEdit = (lines: ChatLine[], id: string, body: string, editedAt: number): ChatLine[] => {
  return lines.map((line) => {
    if (line.id !== id) {
      return line;
    }

    return { ...line, message: body, editedAt };
  });
};

const applyDelete = (lines: ChatLine[], id: string, deletedAt: number): ChatLine[] => {
  return lines.map((line) => {
    if (line.id !== id) {
      return line;
    }

    return { ...line, message: '', deletedAt };
  });
};

export const useChatSync = (roomId: string) => {
  const t = useTranslations('chat');
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.chatMessages(roomId);

  const edit = async (id: string, body: string) => {
    const editedAt = Date.now();

    queryClient.setQueryData<ChatLine[]>(queryKey, (prev) =>
      prev ? applyEdit(prev, id, body, editedAt) : prev,
    );

    try {
      await editChatMessage(id, body);
    } catch {
      await queryClient.invalidateQueries({ queryKey });
      toast.error(t('editFailed'));
    }
  };

  const remove = async (id: string) => {
    const deletedAt = Date.now();

    queryClient.setQueryData<ChatLine[]>(queryKey, (prev) =>
      prev ? applyDelete(prev, id, deletedAt) : prev,
    );

    try {
      await deleteChatMessage(id);
    } catch {
      await queryClient.invalidateQueries({ queryKey });
      toast.error(t('deleteFailed'));
    }
  };

  return { edit, remove };
};
