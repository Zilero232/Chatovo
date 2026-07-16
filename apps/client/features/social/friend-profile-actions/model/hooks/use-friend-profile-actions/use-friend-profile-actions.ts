'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  useAcceptFriendRequest,
  useCallFriend,
  useDeclineFriendRequest,
  useRemoveFriendship,
  useSendFriendRequest,
} from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';

import type { UseFriendProfileActionsInput } from './use-friend-profile-actions.types';

export const useFriendProfileActions = ({
  userId,
  friendTag,
  displayName,
  avatarUrl,
  verified,
}: UseFriendProfileActionsInput) => {
  const t = useTranslations('friends');

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

  const add = () => {
    sendRequest.mutate(
      { tag: friendTag, relationUserId: userId },
      { onError: () => toast.error(t('sendFailed')) },
    );
  };

  const cancelRequest = () => {
    removeFriendship.mutate(userId, { onError: () => toast.error(t('removeFailed')) });
  };

  const accept = (friendshipId: string) => {
    acceptRequest.mutate(
      { friendshipId, userId },
      { onError: () => toast.error(t('acceptFailed')) },
    );
  };

  const decline = (friendshipId: string) => {
    declineRequest.mutate(
      { friendshipId, userId },
      { onError: () => toast.error(t('declineFailed')) },
    );
  };

  const call = () => {
    callFriend.mutate({ userId }, { onError: () => toast.error(t('callFailed')) });
  };

  const openChat = () => {
    openFriendChat({ id: userId, name: displayName, avatarUrl, verified });
  };

  return { isBusy, add, cancelRequest, accept, decline, call, openChat };
};
