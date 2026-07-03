'use client';

import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useIncomingFriendRequests,
} from '@/entities/social/friend';
import { Button, Spinner } from '@/shared/ui';
import { friendsDialogStyles as s } from '../../FriendsDialog.styles';
import { FriendListItem } from '../FriendListItem';
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
          <FriendListItem
            key={entry.friendshipId}
            user={entry.user}
            actions={
              <>
                <Button
                  className={s.action}
                  size="sm"
                  onClick={() => {
                    acceptRequest.mutate(
                      { friendshipId: entry.friendshipId, userId: entry.user.id },
                      { onError: () => toast.error(t('acceptFailed')) },
                    );
                  }}
                >
                  <Check aria-hidden />
                  {t('accept')}
                </Button>
                <Button
                  className={s.action}
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    declineRequest.mutate(
                      { friendshipId: entry.friendshipId, userId: entry.user.id },
                      { onError: () => toast.error(t('declineFailed')) },
                    );
                  }}
                >
                  <X aria-hidden />
                  {t('decline')}
                </Button>
              </>
            }
          />
        ))}
      </div>
    ))
    .otherwise(() => <p className={s.empty}>{t('emptyRequests')}</p>);
};
