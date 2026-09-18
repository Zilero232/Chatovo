'use client';

import { useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';

import { listVoiceChannels } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

/** Every voice channel the viewer can see, flattened across their servers. */
export const useVoiceChannels = () => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.voiceChannels(),
    queryFn: listVoiceChannels,
    staleTime: secondsToMilliseconds(60)
  });

  const channels = data ?? [];

  return { channels, byId: new Map(channels.map((channel) => [channel.id, channel])), isLoading };
};
