'use client';

import { useQueryClient } from '@tanstack/react-query';
import { PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useRef } from 'react';
import { toast } from 'sonner';

import { UserAvatar } from '@/entities/auth/user';
import { useFriendCallRingtone, useOutgoingFriendCall } from '@/entities/social/friend';
import { ackOutgoingFriendCall, cancelOutgoingFriendCall } from '@/shared/api';
import { buildRoomHref, QUERY_KEYS } from '@/shared/constants';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';

import s from './OutgoingCallDialog.module.scss';

export const OutgoingCallDialog = () => {
  const t = useTranslations('friends.outgoingCall');
  const router = useRouter();
  const queryClient = useQueryClient();
  const handledRef = useRef<string | null>(null);

  const { data } = useOutgoingFriendCall();
  const call = data?.call ?? null;
  const isRinging = call?.status === 'ringing';

  useFriendCallRingtone(isRinging, 'outgoing');

  const clearOutgoing = useEffectEvent(async () => {
    await ackOutgoingFriendCall();
    queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), { call: null });
  });

  useEffect(() => {
    if (!call || call.status === 'ringing') {
      return;
    }

    const key = `${call.roomId}:${call.status}`;

    if (handledRef.current === key) {
      return;
    }

    handledRef.current = key;

    if (call.status === 'accepted') {
      router.push(
        buildRoomHref(call.roomId, {
          title: call.callee.name,
        }),
      );
      clearOutgoing();
      return;
    }

    if (call.status === 'declined') {
      toast.error(t('declined', { name: call.callee.name }));
      clearOutgoing();
    }
  }, [call, router, t]);

  const handleCancel = () => {
    cancelOutgoingFriendCall()
      .then(() => {
        queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), { call: null });
      })
      .catch(() => toast.error(t('cancelFailed')));
  };

  return (
    <Dialog open={isRinging} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className={s.content} showCloseButton={false}>
        {call && (
          <>
            <DialogHeader className={s.header}>
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription>{t('description', { name: call.callee.name })}</DialogDescription>
            </DialogHeader>

            <div className={s.callee}>
              <UserAvatar
                className={s.avatar}
                fallbackClassName={s.avatarFallback}
                name={call.callee.name}
                src={call.callee.avatarUrl}
              />
              <span className={s.name}>{call.callee.name}</span>
            </div>

            <Button className={s.cancel} size="lg" variant="secondary" onClick={handleCancel}>
              <PhoneOff aria-hidden />
              {t('cancel')}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
