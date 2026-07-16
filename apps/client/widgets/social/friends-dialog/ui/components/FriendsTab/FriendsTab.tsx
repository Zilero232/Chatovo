'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match, P } from 'ts-pattern';

import { useFriends } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { RemoveFriendConfirmDialog } from '@/features/social/remove-friend';
import { Spinner, Text } from '@/shared/ui';
import { FriendListItem } from '../FriendListItem';

import s from '../../FriendsDialog.module.scss';

import type { FriendEntry, FriendUser } from '@chatovo/schemas';
import type { FriendsTabProps, RemoveTarget } from './FriendsTab.types';

const hasFriends = (friends: FriendEntry[] | undefined): friends is FriendEntry[] => {
  return (friends?.length ?? 0) > 0;
};

export const FriendsTab = ({ enabled }: FriendsTabProps) => {
  const t = useTranslations('friends');

  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const { data: friends, isPending } = useFriends(enabled);
  const { open: openFriendChat, getFriendUnread } = useFriendChat();

  const handleRemove = (user: FriendUser) => {
    setRemoveTarget({ userId: user.id, friendName: user.name });
  };

  return (
    <>
      {match({ isPending, friends })
        .with({ isPending: true }, () => <Spinner className={s.spinner} />)
        .with({ friends: P.when(hasFriends) }, ({ friends: items }) => (
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
                  <FriendListItem
                    dmUnread={getFriendUnread(entry.user.id)}
                    user={entry.user}
                    onOpen={openFriendChat}
                    onRemove={handleRemove}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))
        .otherwise(() => (
          <Text className={s.empty} size="sm" tone="muted">
            {t('emptyFriends')}
          </Text>
        ))}

      {removeTarget && (
        <RemoveFriendConfirmDialog
          friendName={removeTarget.friendName}
          open={Boolean(removeTarget)}
          userId={removeTarget.userId}
          onOpenChange={(open) => {
            if (!open) {
              setRemoveTarget(null);
            }
          }}
        />
      )}
    </>
  );
};
