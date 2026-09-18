'use client';

import type { Server } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { map } from 'remeda';

import { updateServerIcon } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useUpdateServerIcon = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (icon: File | null) => updateServerIcon(serverId, icon),
    onSuccess: (server) => {
      queryClient.setQueryData<Server[]>(QUERY_KEYS.servers(), (prev) =>
        map(prev ?? [], (item) => (item.id === server.id ? server : item))
      );

      queryClient.setQueryData<Server>(QUERY_KEYS.server(server.id), server);
    }
  });
};
