import type { Server, UpdateServerRequest } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { map } from 'remeda';

import { updateServer } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useUpdateServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serverId, input }: { serverId: string; input: UpdateServerRequest }) =>
      updateServer(serverId, input),
    onSuccess: (server) => {
      queryClient.setQueryData<Server[]>(QUERY_KEYS.servers(), (prev) =>
        map(prev ?? [], (item) => (item.id === server.id ? server : item))
      );

      queryClient.setQueryData<Server>(QUERY_KEYS.server(server.id), server);
    }
  });
};
