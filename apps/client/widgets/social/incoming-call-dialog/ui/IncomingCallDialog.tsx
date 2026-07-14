'use client';

import { Phone, PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { UserAvatar } from '@/entities/auth/user';
import {
  useAcceptIncomingFriendCall,
  useDeclineIncomingFriendCall,
  useFriendCallRingtone,
  useIncomingFriendCall,
} from '@/entities/social/friend';
import { buildRoomHref } from '@/shared/constants';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import s from './IncomingCallDialog.module.scss';

export const IncomingCallDialog = () => {
  const t = useTranslations('friends.incomingCall');
  const router = useRouter();

  const { data } = useIncomingFriendCall();
  const acceptCall = useAcceptIncomingFriendCall();
  const declineCall = useDeclineIncomingFriendCall();

  const call = data?.call ?? null;
  const isBusy = acceptCall.isPending || declineCall.isPending;

  useFriendCallRingtone(call !== null, 'incoming');

  const handleDecline = () => {
    declineCall.mutate(undefined, {
      onError: () => toast.error(t('declineFailed')),
    });
  };

  const handleAccept = () => {
    acceptCall.mutate(undefined, {
      onSuccess: (accepted) => {
        if (!accepted) {
          return;
        }

        router.push(
          buildRoomHref(accepted.roomId, {
            title: accepted.caller.name,
          }),
        );
      },
      onError: () => toast.error(t('acceptFailed')),
    });
  };

  return (
    <Dialog open={call !== null} onOpenChange={(open) => !open && !isBusy && handleDecline()}>
      <DialogContent className={s.content} showCloseButton={false}>
        {call && (
          <>
            <DialogHeader className={s.header}>
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description', { name: call.caller.name })}</DialogDescription>
            </DialogHeader>

            <div className={s.caller}>
              <UserAvatar
                className={s.avatar}
                fallbackClassName={s.avatarFallback}
                name={call.caller.name}
                src={call.caller.avatarUrl}
              />
              <span className={s.name}>{call.caller.name}</span>
            </div>

            <div className={s.actions}>
              <Button disabled={isBusy} size="lg" variant="secondary" onClick={handleDecline}>
                <PhoneOff aria-hidden />
                {t('decline')}
              </Button>
              <Button disabled={isBusy} size="lg" onClick={handleAccept}>
                <Phone aria-hidden />
                {t('accept')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
