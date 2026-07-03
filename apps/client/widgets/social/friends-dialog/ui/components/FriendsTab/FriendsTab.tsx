'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { match, P } from 'ts-pattern';
import { useCallFriend, useFriends } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { RemoveFriendConfirmDialog } from '@/features/social/remove-friend';
import { Spinner } from '@/shared/ui';
import { friendsDialogStyles as s } from '../../FriendsDialog.styles';
import { FriendListActions } from '../FriendListActions';
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
  const callFriend = useCallFriend();
  const { open: openFriendChat } = useFriendChat();

  const handleCall = (userId: string) => {
    callFriend.mutate({ userId }, { onError: () => toast.error(t('callFailed')) });
  };

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
                user={entry.user}
                actions={
                  <FriendListActions
                    isCallPending={callFriend.isPending}
                    user={entry.user}
                    onCall={handleCall}
                    onMessage={openFriendChat}
                    onRemove={handleRemove}
                  />
                }
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
