'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';

import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useIncomingFriendRequests,
} from '@/entities/social/friend';
import { Spinner } from '@/shared/ui';
import { FriendRequestListItem } from './FriendRequestListItem';

import s from '../../FriendsDialog.module.scss';

import type { FriendRequestEntry } from '@chatovo/schemas';

const hasRequests = (
  requests: FriendRequestEntry[] | undefined,
): requests is FriendRequestEntry[] => {
  return (requests?.length ?? 0) > 0;
};

export const RequestsTab = () => {
  const t = useTranslations('friends');
  const shouldReduceMotion = useReducedMotion();

  const { data: requests, isPending } = useIncomingFriendRequests();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();

  return match({ isPending, requests })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ requests: P.when(hasRequests) }, ({ requests: items }) => (
      <div className={s.list}>
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((entry) => (
            <motion.div
              key={entry.friendshipId}
              layout
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 460, damping: 34 }}
            >
              <FriendRequestListItem
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ))
    .otherwise(() => <p className={s.empty}>{t('emptyRequests')}</p>);
};
