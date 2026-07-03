import { friendCallStreamSnapshotSchema } from '@chatovo/schemas';
import { QUERY_KEYS } from '@/shared/constants';
import { invalidateFriendsQueries } from './invalidate-friends-queries';
import type { FriendCallStreamSnapshot } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

export const applyFriendsSnapshot = (
  queryClient: QueryClient,
  snapshot: FriendCallStreamSnapshot,
  friendsEpochRef: { current: number | undefined },
): void => {
  const parsed = friendCallStreamSnapshotSchema.safeParse(snapshot);

  if (!parsed.success) {
    return;
  }

  queryClient.setQueryData(QUERY_KEYS.friendCallIncoming(), { call: parsed.data.incoming });
  queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), { call: parsed.data.outgoing });

  const epoch = parsed.data.friendsEpoch;

  if (friendsEpochRef.current !== undefined && epoch !== friendsEpochRef.current) {
    invalidateFriendsQueries(queryClient);
  }

  friendsEpochRef.current = epoch;
};
