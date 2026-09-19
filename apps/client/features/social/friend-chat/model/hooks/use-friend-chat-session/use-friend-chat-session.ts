'use client';

import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToastError } from '@/entities/app/locale';
import { useCloseWhenCallAccepted } from '@/entities/social/friend';
import { getOrCreateFriendDmRoom } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { useCloseWhenInVoiceRoom } from '@/shared/hooks';
import { appEvents } from '@/shared/lib';

import type { FriendChatPeer, FriendChatSession } from '../../types';

export const useFriendChatSession = () => {
  const router = useRouter();
  const pathname = usePathname();

  const toastError = useToastError();

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
    onError: (error, peer) => {
      setOpeningPeer(null);
      toastError(`friend-open-dm-${peer.id}`)(error);
    }
  });

  const open = (peer: FriendChatPeer) => {
    setOpeningPeer(peer);
    openMutation.mutate(peer);
    appEvents.emit.profileCardClose();

    if (pathname !== ROUTES.lobby) {
      router.push(ROUTES.lobby);
    }
  };

  const close = () => {
    setSession(null);
    setOpeningPeer(null);
  };

  useCloseWhenInVoiceRoom(close);
  useCloseWhenCallAccepted(close);

  return {
    session,
    openingPeer,
    isOpening: openMutation.isPending,
    open,
    close
  };
};
