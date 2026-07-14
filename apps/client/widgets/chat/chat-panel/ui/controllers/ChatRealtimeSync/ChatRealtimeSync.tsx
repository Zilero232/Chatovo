'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useRealtimeMessage } from '@/entities/app/realtime';
import { applyChatRealtime } from '../../../model/lib';

export const ChatRealtimeSync = () => {
  const queryClient = useQueryClient();

  useRealtimeMessage((message) => {
    applyChatRealtime(queryClient, message);
  });

  return null;
};
