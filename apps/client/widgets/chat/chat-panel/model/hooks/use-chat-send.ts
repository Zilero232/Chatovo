'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sendChatMessage } from '@/shared/api';

import type { ChatLine } from '../types';

import { appendChatDto, appendChatMessage, dropChatLine, markChatLineStatus } from '../lib';

type SendVariables = {
  body: string;
  id: string;
  replyToId: string | null;
};

type UseChatSendParams = {
  replyToId?: string | null;
  roomId: string;
  sender: NonNullable<ChatLine['from']>;
  threadId?: string | null;
};

export const useChatSend = ({ roomId, sender, threadId, replyToId }: UseChatSendParams) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (variables: SendVariables) =>
      sendChatMessage(variables.id, roomId, variables.body, threadId, variables.replyToId),
    onMutate: ({ id, body, replyToId: replyTo }) => {
      appendChatMessage(
        queryClient,
        roomId,
        {
          id,
          timestamp: Date.now(),
          message: body,
          replyToId: replyTo,
          status: 'sending',
          from: sender
        },
        threadId
      );
    },
    onSuccess: (saved) => {
      appendChatDto(queryClient, roomId, saved);
    },
    onError: (_error, { id }) => {
      markChatLineStatus(queryClient, roomId, id, 'failed', threadId);
    }
  });

  const send = async (body: string, id?: string) => {
    if (id) {
      markChatLineStatus(queryClient, roomId, id, 'sending', threadId);
    }

    try {
      await mutateAsync({ id: id ?? crypto.randomUUID(), body, replyToId: replyToId ?? null });
    } catch {}
  };

  const sendAttachment = async (body: string) => {
    try {
      await mutateAsync({ id: crypto.randomUUID(), body, replyToId: null });
    } catch {}
  };

  const retry = (id: string, body: string) => send(body, id);

  const discard = (id: string) => {
    dropChatLine(queryClient, roomId, id, threadId);
  };

  return { send, sendAttachment, retry, discard, isPending };
};
