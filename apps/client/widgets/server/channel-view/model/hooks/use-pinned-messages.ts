'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchPinnedMessages } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const usePinnedMessages = (roomId: string, enabled: boolean) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.chatPinnedMessages(roomId),
    queryFn: () => fetchPinnedMessages(roomId),
    enabled
  });

  return { pinned: data ?? [], isLoading };
};
