'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRealtimeMessage } from '@/entities/app/realtime';
import { applyChatRealtimeMessage } from '../../../model/lib';

export const ChatRealtimeSync = () => {
  const queryClient = useQueryClient();

  useRealtimeMessage((message) => {
    if (
      message.type !== 'chat.message' &&
      message.type !== 'chat.edit' &&
      message.type !== 'chat.delete'
    ) {
      return;
    }

    applyChatRealtimeMessage(queryClient, message);
  });

  return null;
};
