'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useRealtimeMessage, useRealtimeServerSubscribe } from '@/entities/app/realtime';
import { useCurrentUser } from '@/entities/auth/user';
import { useServers } from '@/entities/server/server';

import { applyServerRealtime } from '../model/lib/apply-server-realtime';

export const ServerRealtimeSync = () => {
  const queryClient = useQueryClient();

  const { user } = useCurrentUser();
  const { servers } = useServers();

  useRealtimeServerSubscribe(servers.map((server) => server.id));

  useRealtimeMessage((message) => {
    applyServerRealtime(queryClient, message, user?.id ?? null);
  });

  return null;
};
