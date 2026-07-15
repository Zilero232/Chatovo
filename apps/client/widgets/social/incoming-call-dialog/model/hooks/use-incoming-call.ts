'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  useAcceptIncomingFriendCall,
  useDeclineIncomingFriendCall,
  useFriendCallRingtone,
  useIncomingFriendCall,
} from '@/entities/social/friend';
import { buildRoomHref } from '@/shared/constants';

export const useIncomingCall = () => {
  const t = useTranslations('friends.incomingCall');
  const router = useRouter();

  const { data } = useIncomingFriendCall();
  const acceptCall = useAcceptIncomingFriendCall();
  const declineCall = useDeclineIncomingFriendCall();

  const call = data?.call ?? null;
  const isBusy = acceptCall.isPending || declineCall.isPending;

  useFriendCallRingtone(call !== null, 'incoming');

  const decline = () => {
    declineCall.mutate(undefined, {
      onError: () => toast.error(t('declineFailed')),
    });
  };

  const accept = () => {
    acceptCall.mutate(undefined, {
      onSuccess: (accepted) => {
        if (!accepted) {
          return;
        }

        router.push(buildRoomHref(accepted.roomId, { title: accepted.caller.name }));
      },
      onError: () => toast.error(t('acceptFailed')),
    });
  };

  return { call, isBusy, accept, decline };
};
