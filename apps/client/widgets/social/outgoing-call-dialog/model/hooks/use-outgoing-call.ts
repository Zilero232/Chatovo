'use client';

import { friendCallStatusSchema } from '@chatovo/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useRef } from 'react';
import { toast } from 'sonner';

import { useFriendCallRingtone, useOutgoingFriendCall } from '@/entities/social/friend';
import { ackOutgoingFriendCall, cancelOutgoingFriendCall } from '@/shared/api';
import { buildRoomHref, QUERY_KEYS } from '@/shared/constants';

const CALL_STATUS = friendCallStatusSchema.enum;

export const useOutgoingCall = () => {
  const t = useTranslations('friends.outgoingCall');
  const router = useRouter();
  const queryClient = useQueryClient();
  const handledRef = useRef<string | null>(null);

  const { data } = useOutgoingFriendCall();
  const call = data?.call ?? null;
  const isRinging = call?.status === CALL_STATUS.ringing;

  useFriendCallRingtone(isRinging, 'outgoing');

  const clearOutgoing = useEffectEvent(async () => {
    await ackOutgoingFriendCall();
    queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), { call: null });
  });

  useEffect(() => {
    if (!call || call.status === CALL_STATUS.ringing) {
      return;
    }

    const key = `${call.roomId}:${call.status}`;

    if (handledRef.current === key) {
      return;
    }

    handledRef.current = key;

    if (call.status === CALL_STATUS.accepted) {
      router.push(buildRoomHref(call.roomId, { title: call.callee.name }));
      clearOutgoing();
      return;
    }

    if (call.status === CALL_STATUS.declined) {
      toast.error(t('declined', { name: call.callee.name }));
      clearOutgoing();
    }
  }, [call, router, t]);

  const cancel = async () => {
    try {
      await cancelOutgoingFriendCall();
      queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), { call: null });
    } catch {
      toast.error(t('cancelFailed'));
    }
  };

  return { call, isRinging, cancel };
};
