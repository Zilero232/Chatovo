'use client';

import type { FriendRequestEntry } from '@chatovo/schemas';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';

import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useIncomingFriendRequests
} from '@/entities/social/friend';
import { Spinner, Text } from '@/shared/ui';

import { FriendRequestListItem } from './FriendRequestListItem';
import {
  REQUEST_ITEM_ANIMATE,
  REQUEST_ITEM_EXIT,
  REQUEST_ITEM_INITIAL,
  REQUEST_ITEM_REDUCED,
  REQUEST_ITEM_TRANSITION
} from './RequestsTab.motion';

import s from '../../FriendsDialog.module.scss';

const hasRequests = (
  requests: FriendRequestEntry[] | undefined
): requests is FriendRequestEntry[] => (requests?.length ?? 0) > 0;

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
        <AnimatePresence initial={false} mode='popLayout'>
          {items.map((entry) => (
            <motion.div
              layout
              key={entry.friendshipId}
              animate={REQUEST_ITEM_ANIMATE}
              exit={shouldReduceMotion ? REQUEST_ITEM_REDUCED : REQUEST_ITEM_EXIT}
              initial={shouldReduceMotion ? REQUEST_ITEM_REDUCED : REQUEST_ITEM_INITIAL}
              transition={REQUEST_ITEM_TRANSITION}
            >
              <FriendRequestListItem
                entry={entry}
                isAccepting={acceptRequest.isPending}
                isDeclining={declineRequest.isPending}
                onAccept={() => {
                  acceptRequest.mutate(
                    { friendshipId: entry.friendshipId, userId: entry.user.id },
                    { onError: () => toast.error(t('acceptFailed')) }
                  );
                }}
                onDecline={() => {
                  declineRequest.mutate(
                    { friendshipId: entry.friendshipId, userId: entry.user.id },
                    { onError: () => toast.error(t('declineFailed')) }
                  );
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ))
    .otherwise(() => (
      <Text className={s.empty} size='sm' tone='muted'>
        {t('emptyRequests')}
      </Text>
    ));
};
