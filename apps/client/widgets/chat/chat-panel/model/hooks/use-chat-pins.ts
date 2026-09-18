'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToastError } from '@/entities/app/locale';
import { pinChatMessage } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { patchChatLines } from '../lib';

type PinVariables = {
  id: string;
  pinned: boolean;
};

export const useChatPins = (roomId: string, threadId?: string | null) => {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  const pinMutation = useMutation({
    mutationFn: ({ id, pinned }: PinVariables) => pinChatMessage(id, pinned),
    onSuccess: (saved) => {
      patchChatLines(
        queryClient,
        roomId,
        (lines) =>
          lines?.map((line) => (line.id === saved.id ? { ...line, pinned: saved.pinned } : line)),
        threadId
      );
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatPinnedMessages(roomId) });
    },
    onError: (error, { id }) => toastError(`chat-pin-${id}`)(error)
  });

  const togglePin = (id: string, pinned: boolean) => pinMutation.mutate({ id, pinned });

  return { togglePin };
};
