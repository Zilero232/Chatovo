'use client';

import { safeJsonParse } from '@chatovo/schemas';
import { useDataChannel } from '@livekit/components-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffectEvent } from 'react';
import { toast } from 'sonner';
import { deleteChatMessage, editChatMessage } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { CHAT_SYNC_TOPIC } from '../config';
import type { ChatLine, ChatSyncEvent } from '../types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const parseSyncEvent = (raw: string): ChatSyncEvent | null => {
  const data = safeJsonParse(raw) as Partial<ChatSyncEvent>;

  if (typeof data.id !== 'string') {
    return null;
  }

  if (data.kind === 'edit' && typeof data.body === 'string' && typeof data.editedAt === 'number') {
    return { kind: 'edit', id: data.id, body: data.body, editedAt: data.editedAt };
  }

  if (data.kind === 'delete' && typeof data.deletedAt === 'number') {
    return { kind: 'delete', id: data.id, deletedAt: data.deletedAt };
  }

  return null;
};

const applyEvent = (lines: ChatLine[], event: ChatSyncEvent): ChatLine[] => {
  return lines.map((line) => {
    if (line.id !== event.id) {
      return line;
    }

    if (event.kind === 'edit') {
      return { ...line, message: event.body, editedAt: event.editedAt };
    }

    return { ...line, message: '', deletedAt: event.deletedAt };
  });
};

export const useChatSync = (roomId: string) => {
  const t = useTranslations('chat');

  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.chatMessages(roomId);

  const apply = (event: ChatSyncEvent) => {
    queryClient.setQueryData<ChatLine[]>(queryKey, (prev) =>
      prev ? applyEvent(prev, event) : prev,
    );
  };

  const onMessage = useEffectEvent((msg: { payload: Uint8Array }) => {
    const event = parseSyncEvent(decoder.decode(msg.payload));

    if (event) {
      apply(event);
    }
  });

  const { send } = useDataChannel(CHAT_SYNC_TOPIC, onMessage);

  const broadcast = (event: ChatSyncEvent) => {
    send(encoder.encode(JSON.stringify(event)), { reliable: true });
  };

  const edit = async (id: string, body: string) => {
    const editedAt = Date.now();
    const event: ChatSyncEvent = { kind: 'edit', id, body, editedAt };

    apply(event);

    try {
      await editChatMessage(id, body);
      broadcast(event);
    } catch {
      await queryClient.invalidateQueries({ queryKey });
      toast.error(t('editFailed'));
    }
  };

  const remove = async (id: string) => {
    const deletedAt = Date.now();
    const event: ChatSyncEvent = { kind: 'delete', id, deletedAt };

    apply(event);

    try {
      await deleteChatMessage(id);
      broadcast(event);
    } catch {
      await queryClient.invalidateQueries({ queryKey });
      toast.error(t('deleteFailed'));
    }
  };

  return { edit, remove };
};
