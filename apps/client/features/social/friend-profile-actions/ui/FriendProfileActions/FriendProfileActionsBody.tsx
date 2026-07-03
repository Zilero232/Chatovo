'use client';

import { Check, MessageSquare, Phone, UserMinus, UserPlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { match } from 'ts-pattern';
import {
  useAcceptFriendRequest,
  useCallFriend,
  useDeclineFriendRequest,
  useRemoveFriendship,
  useSendFriendRequest,
} from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';
import { RemoveFriendConfirmDialog } from '@/features/social/remove-friend';
import { Button } from '@/shared/ui';
import { friendProfileActionsStyles as s } from './FriendProfileActions.styles';
import type { FriendshipRelation } from '@chatovo/schemas';

type FriendProfileActionsBodyProps = {
  state: FriendshipRelation;
  userId: string;
  friendTag: string;
  displayName: string;
  avatarUrl: string | null;
  verified: boolean;
};

export const FriendProfileActionsBody = ({
  state,
  userId,
  friendTag,
  displayName,
  avatarUrl,
  verified,
}: FriendProfileActionsBodyProps) => {
  const t = useTranslations('friends');

  const [removeOpen, setRemoveOpen] = useState(false);

  const sendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();
  const removeFriendship = useRemoveFriendship();
  const callFriend = useCallFriend();
  const { open: openFriendChat } = useFriendChat();

  const isBusy =
    sendRequest.isPending ||
    acceptRequest.isPending ||
    declineRequest.isPending ||
    removeFriendship.isPending ||
    callFriend.isPending;

  return (
    <>
      {match(state)
        .with({ status: 'none' }, () => (
          <Button
            className={s.button}
            disabled={isBusy}
            size="sm"
            onClick={() => {
              sendRequest.mutate(
                { tag: friendTag, relationUserId: userId },
                {
                  onError: () => toast.error(t('sendFailed')),
                },
              );
            }}
          >
            <UserPlus aria-hidden />
            {t('addFriend')}
          </Button>
        ))
        .with({ status: 'outgoing_pending' }, () => (
          <Button
            className={s.button}
            disabled={isBusy}
            size="sm"
            variant="secondary"
            onClick={() => {
              removeFriendship.mutate(userId, {
                onError: () => toast.error(t('removeFailed')),
              });
            }}
          >
            <X aria-hidden />
            {t('cancelRequest')}
          </Button>
        ))
        .with({ status: 'incoming_pending' }, ({ friendshipId }) => (
          <div className={s.row}>
            <Button
              className={s.button}
              disabled={isBusy}
              size="sm"
              onClick={() => {
                acceptRequest.mutate(
                  { friendshipId, userId },
                  { onError: () => toast.error(t('acceptFailed')) },
                );
              }}
            >
              <Check aria-hidden />
              {t('accept')}
            </Button>
            <Button
              className={s.button}
              disabled={isBusy}
              size="sm"
              variant="secondary"
              onClick={() => {
                declineRequest.mutate(
                  { friendshipId, userId },
                  { onError: () => toast.error(t('declineFailed')) },
                );
              }}
            >
              <X aria-hidden />
              {t('decline')}
            </Button>
          </div>
        ))
        .with({ status: 'friends' }, () => (
          <div className="flex w-full flex-col gap-2">
            <div className={s.friendsPrimary}>
              <Button
                className={s.friendsAction}
                disabled={isBusy}
                size="sm"
                variant="outline"
                onClick={() =>
                  openFriendChat({
                    id: userId,
                    name: displayName,
                    avatarUrl,
                    verified,
                  })
                }
              >
                <MessageSquare aria-hidden />
                {t('messageFriend')}
              </Button>
              <Button
                className={s.friendsAction}
                disabled={isBusy}
                size="sm"
                onClick={() => {
                  callFriend.mutate({ userId }, { onError: () => toast.error(t('callFailed')) });
                }}
              >
                <Phone aria-hidden />
                {t('callFriend')}
              </Button>
            </div>
            <Button
              className={s.friendsRemove}
              disabled={isBusy}
              size="sm"
              variant="ghost"
              onClick={() => setRemoveOpen(true)}
            >
              <UserMinus aria-hidden />
              {t('removeFriend')}
            </Button>
          </div>
        ))
        .exhaustive()}

      <RemoveFriendConfirmDialog
        friendName={displayName}
        open={removeOpen}
        userId={userId}
        onOpenChange={setRemoveOpen}
      />
    </>
  );
};
