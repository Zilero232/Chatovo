import type { ChannelReadState } from '@chatovo/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import { listReadStates, markChannelRead, muteChannel } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useReadStates = (serverId: string | null) => {
  const { data } = useQuery({
    queryKey: QUERY_KEYS.readStates(serverId),
    queryFn: () => listReadStates(serverId as string),
    enabled: isNonNullish(serverId)
  });

  const states = data ?? [];
  const byChannel = new Map(states.map((state) => [state.channelId, state]));

  return { states, byChannel };
};

const replaceState = (previous: ChannelReadState[] | undefined, next: ChannelReadState) => {
  const rest = (previous ?? []).filter((state) => state.channelId !== next.channelId);

  return [...rest, next];
};

export const useMarkChannelRead = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, lastReadAt }: { channelId: string; lastReadAt?: string }) =>
      markChannelRead(channelId, lastReadAt),
    onSuccess: (state) => {
      queryClient.setQueryData<ChannelReadState[]>(QUERY_KEYS.readStates(serverId), (prev) =>
        replaceState(prev, state)
      );
    }
  });
};

export const useMuteChannel = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ channelId, mutedUntil }: { channelId: string; mutedUntil: string | null }) =>
      muteChannel(channelId, mutedUntil),
    onSuccess: (state) => {
      queryClient.setQueryData<ChannelReadState[]>(QUERY_KEYS.readStates(serverId), (prev) =>
        replaceState(prev, state)
      );
    }
  });
};
