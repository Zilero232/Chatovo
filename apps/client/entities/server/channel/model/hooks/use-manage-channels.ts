import type { CreateChannelRequest, UpdateChannelRequest } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createChannel, deleteChannel, reorderChannels, updateChannel } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useCreateChannel = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateChannelRequest) => createChannel(serverId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useUpdateChannel = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, input }: { channelId: string; input: UpdateChannelRequest }) =>
      updateChannel(channelId, input),
    onSuccess: (channel) => {
      queryClient.setQueryData(QUERY_KEYS.channel(channel.id), channel);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useDeleteChannel = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChannel,
    onSuccess: (_, channelId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.channel(channelId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useReorderChannels = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof reorderChannels>[1]) => reorderChannels(serverId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};
