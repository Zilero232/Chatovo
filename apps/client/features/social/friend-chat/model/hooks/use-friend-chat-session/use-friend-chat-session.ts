'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useCloseWhenCallAccepted } from '@/entities/social/friend';
import { getOrCreateFriendDmRoom } from '@/shared/api';
import { useCloseWhenInVoiceRoom } from '@/shared/hooks';

import type { FriendChatPeer, FriendChatSession } from '../../types';

export const useFriendChatSession = () => {
  const t = useTranslations('friends');

  const [session, setSession] = useState<FriendChatSession | null>(null);
  const [openingPeer, setOpeningPeer] = useState<FriendChatPeer | null>(null);
  const [closeGuard, setCloseGuard] = useState(false);

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
    setCloseGuard(true);
    setSession(null);
    setOpeningPeer(null);
  };

  useCloseWhenInVoiceRoom(close);
  useCloseWhenCallAccepted(close);

  useEffect(() => {
    if (!closeGuard) {
      return;
    }

    let innerId = 0;
    const outerId = requestAnimationFrame(() => {
      innerId = requestAnimationFrame(() => setCloseGuard(false));
    });

    return () => {
      cancelAnimationFrame(outerId);
      cancelAnimationFrame(innerId);
    };
  }, [closeGuard]);

  const blocksParentDialogClose = session !== null || openingPeer !== null || closeGuard;

  return {
    session,
    openingPeer,
    isOpening: openMutation.isPending,
    blocksParentDialogClose,
    open,
    close,
  };
};
