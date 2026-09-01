'use client';

import type { FriendRequestEntry } from '@chatovo/schemas';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';

import { useErrorMessage } from '@/entities/app/locale';
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useIncomingFriendRequests
} from '@/entities/social/friend';
import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';
import { CenteredState, Spinner } from '@/ui-kit';

import { FriendRequestListItem } from './FriendRequestListItem';

import s from '../../FriendsDialog.module.scss';

const hasRequests = (
  requests: FriendRequestEntry[] | undefined
): requests is FriendRequestEntry[] => (requests?.length ?? 0) > 0;

export const RequestsTab = () => {
  const t = useTranslations('friends');
  const errorMessage = useErrorMessage();

  const { data: requests, isPending } = useIncomingFriendRequests();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();

  return match({ isPending, requests })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ requests: P.when(hasRequests) }, ({ requests: items }) => (
      <div className={s.list}>
        <AnimatePresence initial={false} mode='popLayout'>
          {items.map((entry) => (
            <motion.div
              key={entry.friendshipId}
              animate={LIST_ITEM_ANIMATE}
              exit={LIST_ITEM_EXIT}
              initial={LIST_ITEM_INITIAL}
              layout='position'
              transition={LIST_ITEM_TRANSITION}
            >
              <FriendRequestListItem
                entry={entry}
                isAccepting={acceptRequest.isPending}
                isDeclining={declineRequest.isPending}
                onAccept={() => {
                  acceptRequest.mutate(
                    { friendshipId: entry.friendshipId, userId: entry.user.id },
                    {
                      onError: (err: Error) =>
                        toast.error(errorMessage(err), {
                          id: `friend-request-accept-${entry.user.id}`
                        })
                    }
                  );
                }}
                onDecline={() => {
                  declineRequest.mutate(
                    { friendshipId: entry.friendshipId, userId: entry.user.id },
                    {
                      onError: (err: Error) =>
                        toast.error(errorMessage(err), {
                          id: `friend-request-decline-${entry.user.id}`
                        })
                    }
                  );
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ))
    .otherwise(() => (
      <CenteredState
        className={s.empty}
        description={t('emptyRequestsHint')}
        pattern='dots'
        size='sm'
        title={t('emptyRequestsTitle')}
      />
    ));
};
