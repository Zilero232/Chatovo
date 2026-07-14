'use client';

import { useQuery } from '@tanstack/react-query';

import { listIncomingFriendRequests } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useIncomingFriendRequests = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.friendRequestsIncoming(),
    queryFn: listIncomingFriendRequests,
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
