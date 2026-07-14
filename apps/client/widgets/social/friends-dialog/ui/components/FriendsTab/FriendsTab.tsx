'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match, P } from 'ts-pattern';
import { useFriends } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { RemoveFriendConfirmDialog } from '@/features/social/remove-friend';
import { Spinner } from '@/shared/ui';
import s from '../../FriendsDialog.module.scss';
import { FriendListItem } from '../FriendListItem';
import type { FriendEntry, FriendUser } from '@chatovo/schemas';

type FriendsTabProps = {
  enabled: boolean;
};

type RemoveTarget = {
  userId: string;
  friendName: string;
};

const hasFriends = (friends: FriendEntry[] | undefined): friends is FriendEntry[] => {
  return (friends?.length ?? 0) > 0;
};

export const FriendsTab = ({ enabled }: FriendsTabProps) => {
  const t = useTranslations('friends');

  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);

  const { data: friends, isPending } = useFriends(enabled);
  const { open: openFriendChat, getFriendUnread } = useFriendChat();

  const handleRemove = (user: FriendUser) => {
    setRemoveTarget({ userId: user.id, friendName: user.name });
  };

  return (
    <>
      {match({ isPending, friends })
        .with({ isPending: true }, () => <Spinner className="mx-auto my-8" />)
        .with({ friends: P.when(hasFriends) }, ({ friends: items }) => (
          <div className={s.list}>
            {items.map((entry) => (
              <FriendListItem
                key={entry.friendshipId}
                dmUnread={getFriendUnread(entry.user.id)}
                user={entry.user}
                onOpen={openFriendChat}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ))
        .otherwise(() => (
          <p className={s.empty}>{t('emptyFriends')}</p>
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
