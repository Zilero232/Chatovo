'use client';

import type { ChatReaction } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToastError } from '@/entities/app/locale';
import { addChatReaction, removeChatReaction } from '@/shared/api';

import { patchChatLines } from '../lib';

type ToggleVariables = {
  emoji: string;
  hasReacted: boolean;
  id: string;
};

export const useChatReactions = (roomId: string, threadId?: string | null) => {
  const queryClient = useQueryClient();
  const toastError = useToastError();

  const applyReactions = (id: string, reactions: ChatReaction[]) => {
    patchChatLines(
      queryClient,
      roomId,
      (lines) => lines?.map((line) => (line.id === id ? { ...line, reactions } : line)),
      threadId
    );
  };

  const toggleMutation = useMutation({
    mutationFn: ({ id, emoji, hasReacted }: ToggleVariables) =>
      hasReacted ? removeChatReaction(id, emoji) : addChatReaction(id, emoji),
    onSuccess: (reactions, { id }) => applyReactions(id, reactions),
    onError: (error, { id, emoji }) => toastError(`chat-reaction-${id}-${emoji}`)(error)
  });

  const toggleReaction = (id: string, emoji: string, hasReacted: boolean) =>
    toggleMutation.mutate({ id, emoji, hasReacted });

  return { toggleReaction };
};
