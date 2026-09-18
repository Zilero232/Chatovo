import type { Server } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filter } from 'remeda';

import { deleteServer, leaveServer } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

const dropServerFromCache = (queryClient: ReturnType<typeof useQueryClient>, serverId: string) => {
  queryClient.setQueryData<Server[]>(QUERY_KEYS.servers(), (prev) =>
    filter(prev ?? [], (item) => item.id !== serverId)
  );

  queryClient.removeQueries({ queryKey: QUERY_KEYS.server(serverId) });
  queryClient.removeQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
};

export const useDeleteServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServer,
    onSuccess: (_, serverId) => dropServerFromCache(queryClient, serverId)
  });
};

export const useLeaveServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveServer,
    onSuccess: (_, serverId) => dropServerFromCache(queryClient, serverId)
  });
};
