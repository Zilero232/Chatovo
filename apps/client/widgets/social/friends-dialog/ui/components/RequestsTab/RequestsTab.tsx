'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useIncomingFriendRequests,
} from '@/entities/social/friend';
import { Spinner } from '@/shared/ui';
import s from '../../FriendsDialog.module.scss';
import { FriendRequestListItem } from './FriendRequestListItem';
import type { FriendRequestEntry } from '@chatovo/schemas';

const hasRequests = (
  requests: FriendRequestEntry[] | undefined,
): requests is FriendRequestEntry[] => {
  return (requests?.length ?? 0) > 0;
};

export const RequestsTab = () => {
  const t = useTranslations('friends');

  const { data: requests, isPending } = useIncomingFriendRequests();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();

  return match({ isPending, requests })
    .with({ isPending: true }, () => <Spinner className="mx-auto my-8" />)
    .with({ requests: P.when(hasRequests) }, ({ requests: items }) => (
      <div className={s.list}>
        {items.map((entry) => (
          <FriendRequestListItem
            key={entry.friendshipId}
            entry={entry}
            isAccepting={acceptRequest.isPending}
            isDeclining={declineRequest.isPending}
            onAccept={() => {
              acceptRequest.mutate(
                { friendshipId: entry.friendshipId, userId: entry.user.id },
                { onError: () => toast.error(t('acceptFailed')) },
              );
            }}
            onDecline={() => {
              declineRequest.mutate(
                { friendshipId: entry.friendshipId, userId: entry.user.id },
                { onError: () => toast.error(t('declineFailed')) },
              );
            }}
          />
        ))}
      </div>
    ))
    .otherwise(() => <p className={s.empty}>{t('emptyRequests')}</p>);
};
