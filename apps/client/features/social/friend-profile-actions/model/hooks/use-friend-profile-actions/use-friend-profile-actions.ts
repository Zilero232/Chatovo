'use client';

import { toast } from 'sonner';

import { useErrorMessage } from '@/entities/app/locale';
import {
  useAcceptFriendRequest,
  useCallFriend,
  useDeclineFriendRequest,
  useRemoveFriendship,
  useSendFriendRequest
} from '@/entities/social/friend';

import type { UseFriendProfileActionsInput } from './use-friend-profile-actions.types';

export const useFriendProfileActions = ({ userId, friendTag }: UseFriendProfileActionsInput) => {
  const errorMessage = useErrorMessage();

  const sendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();
  const removeFriendship = useRemoveFriendship();
  const callFriend = useCallFriend();

  const isBusy =
    sendRequest.isPending ||
    acceptRequest.isPending ||
    declineRequest.isPending ||
    removeFriendship.isPending ||
    callFriend.isPending;

  const add = () => {
    sendRequest.mutate(
      { tag: friendTag, relationUserId: userId },
      {
        onError: (err: Error) =>
          toast.error(errorMessage(err), { id: `friend-request-send-${userId}` })
      }
    );
  };

  const cancelRequest = () => {
    removeFriendship.mutate(userId, {
      onError: (err: Error) => toast.error(errorMessage(err), { id: `friend-remove-${userId}` })
    });
  };

  const accept = (friendshipId: string) => {
    acceptRequest.mutate(
      { friendshipId, userId },
      {
        onError: (err: Error) =>
          toast.error(errorMessage(err), { id: `friend-request-accept-${userId}` })
      }
    );
  };

  const decline = (friendshipId: string) => {
    declineRequest.mutate(
      { friendshipId, userId },
      {
        onError: (err: Error) =>
          toast.error(errorMessage(err), { id: `friend-request-decline-${userId}` })
      }
    );
  };

  const call = () => {
    callFriend.mutate(
      { userId },
      { onError: (err: Error) => toast.error(errorMessage(err), { id: `friend-call-${userId}` }) }
    );
  };

  return { isBusy, add, cancelRequest, accept, decline, call };
};
