import { QUERY_KEYS } from '@/shared/constants';

import type { QueryClient } from '@tanstack/react-query';

export const invalidateFriendsQueries = (queryClient: QueryClient, userId?: string) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friends() });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendRequestsIncoming() });
  queryClient.invalidateQueries({ queryKey: ['friend-by-tag'] });

  if (userId) {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendshipRelation(userId) });
  }
};
