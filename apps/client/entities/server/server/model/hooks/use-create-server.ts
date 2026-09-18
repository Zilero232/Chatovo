import type { Server } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uniqueBy } from 'remeda';

import { createServer } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useCreateServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServer,
    onSuccess: (server) => {
      queryClient.setQueryData<Server[]>(QUERY_KEYS.servers(), (prev) => {
        const next: Server[] = [...(prev ?? []), server];

        return uniqueBy(next, (item) => item.id);
      });

      queryClient.setQueryData<Server>(QUERY_KEYS.server(server.id), server);
    }
  });
};
