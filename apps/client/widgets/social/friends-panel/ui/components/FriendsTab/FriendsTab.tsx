'use client';

import type { FriendEntry, FriendUser } from '@chatovo/schemas';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isEmpty } from 'remeda';
import { match, P } from 'ts-pattern';

import { useFriends } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { RemoveFriendConfirmDialog } from '@/features/social/remove-friend';
import { CenteredState, Spinner } from '@/ui-kit';

import type { FriendsTabProps, RemoveTarget } from './FriendsTab.types';

import { FriendsList } from '../FriendsList/FriendsList';

import s from '../../FriendsPanel.module.scss';

const hasFriends = (friends: FriendEntry[]): friends is [FriendEntry, ...FriendEntry[]] =>
  !isEmpty(friends);

export const FriendsTab = ({ countLabel, query, onlyOnline = false }: FriendsTabProps) => {
  const t = useTranslations('friends');

  const { data, isPending } = useFriends();
  const { open: openFriendChat, getFriendUnread } = useFriendChat();

  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);

  const search = query.trim().toLowerCase();
  const friends = (data ?? [])
    .filter((entry) => !onlyOnline || entry.user.isOnline)
    .filter((entry) => !search || entry.user.name.toLowerCase().includes(search));

  const handleRemove = (user: FriendUser) => {
    setRemoveTarget({ userId: user.id, friendName: user.name });
  };

  return (
    <>
      {match({ isPending, friends })
        .with({ isPending: true }, () => <Spinner className={s.spinner} />)
        .with({ friends: P.when(hasFriends) }, ({ friends: items }) => (
          <FriendsList
            countLabel={countLabel}
            getUnread={getFriendUnread}
            items={items}
            onOpen={openFriendChat}
            onRemove={handleRemove}
          />
        ))
        .with({ friends: P.when(() => Boolean(search)) }, () => (
          <CenteredState
            className={s.empty}
            description={t('nothingFoundHint')}
            pattern='dots'
            size='sm'
            title={t('nothingFound')}
          />
        ))
        .otherwise(() => (
          <CenteredState
            className={s.empty}
            description={t('emptyFriendsHint')}
            pattern='dots'
            size='sm'
            title={t(onlyOnline ? 'emptyOnlineTitle' : 'emptyFriendsTitle')}
          />
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
