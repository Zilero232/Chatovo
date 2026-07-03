'use client';

import { createContextHook } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useState } from 'react';
import { toast } from 'sonner';
import { useOutgoingFriendCall } from '@/entities/social/friend';
import { getOrCreateFriendDmRoom } from '@/shared/api';
import { useCloseWhenInVoiceRoom } from '@/shared/hooks';
import type { ReactNode } from 'react';
import type { FriendChatPeer, FriendChatSession } from '../types';

const useFriendChatState = () => {
  const t = useTranslations('friends');
  const [session, setSession] = useState<FriendChatSession | null>(null);
  const [openingPeer, setOpeningPeer] = useState<FriendChatPeer | null>(null);

  const openMutation = useMutation({
    mutationFn: async (peer: FriendChatPeer) => {
      const room = await getOrCreateFriendDmRoom(peer.id);

      return { room, peer };
    },
    onSuccess: ({ room, peer }) => {
      setSession({ roomId: room.id, peer });
      setOpeningPeer(null);
    },
    onError: () => {
      setOpeningPeer(null);
      toast.error(t('openDmFailed'));
    },
  });

  const open = (peer: FriendChatPeer) => {
    setOpeningPeer(peer);
    openMutation.mutate(peer);
  };

  const close = () => {
    setSession(null);
    setOpeningPeer(null);
  };

  const { data: outgoingCall } = useOutgoingFriendCall();
  const closeOnCall = useEffectEvent(close);

  useCloseWhenInVoiceRoom(close);

  useEffect(() => {
    if (outgoingCall?.call) {
      closeOnCall();
    }
  }, [outgoingCall?.call]);

  return {
    session,
    openingPeer,
    isOpening: openMutation.isPending,
    open,
    close,
  };
};

const { Provider, use } = createContextHook(useFriendChatState);

export const FriendChatProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useFriendChat = () => {
  const value = use();

  if (!value) {
    throw new Error('useFriendChat must be used within FriendChatProvider');
  }

  return value;
};
