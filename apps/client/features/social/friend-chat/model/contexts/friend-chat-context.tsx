'use client';

import { createContextHook, useAudio } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useState } from 'react';
import { sum, values } from 'remeda';
import { toast } from 'sonner';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { getOrCreateFriendDmRoom } from '@/shared/api';
import { useActiveVoiceRoomId, useCloseWhenInVoiceRoom } from '@/shared/hooks';
import { appEvents } from '@/shared/lib';

import type { ReactNode } from 'react';
import type { FriendChatPeer, FriendChatSession } from '../types';

const MESSAGE_SOUND_SRC = '/audios/notification.mp3';

const useFriendChatState = () => {
  const t = useTranslations('friends');
  const { user } = useCurrentUser();
  const { settings } = useAppSettings();
  const messageAudio = useAudio(MESSAGE_SOUND_SRC, { interrupt: true });

  const [session, setSession] = useState<FriendChatSession | null>(null);
  const [openingPeer, setOpeningPeer] = useState<FriendChatPeer | null>(null);
  const [closeGuard, setCloseGuard] = useState(false);
  const [unreadByFriend, setUnreadByFriend] = useState<Record<string, number>>({});
  const activeVoiceRoomId = useActiveVoiceRoomId();

  const dmUnread = sum(values(unreadByFriend));

  const clearFriendUnread = (friendId: string) => {
    setUnreadByFriend((prev) => {
      if (!(friendId in prev)) {
        return prev;
      }

      const next = { ...prev };
      delete next[friendId];

      return next;
    });
  };

  const getFriendUnread = (friendId: string) => {
    return unreadByFriend[friendId] ?? 0;
  };

  const openMutation = useMutation({
    mutationFn: async (peer: FriendChatPeer) => {
      const room = await getOrCreateFriendDmRoom(peer.id);

      return { room, peer };
    },
    onSuccess: ({ room, peer }) => {
      setSession({ roomId: room.id, peer });
      setOpeningPeer(null);
      clearFriendUnread(peer.id);
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

  const clearPeerUnread = useEffectEvent((friendId: string) => {
    clearFriendUnread(friendId);
  });

  useEffect(() => {
    if (session?.peer.id) {
      clearPeerUnread(session.peer.id);
    }
  }, [session?.peer.id]);

  appEvents.on.chatMessage(({ roomId, senderId, roomKind }) => {
    if (
      roomKind !== 'dm' ||
      !senderId ||
      senderId === user?.id ||
      session?.roomId === roomId ||
      activeVoiceRoomId === roomId
    ) {
      return;
    }

    setUnreadByFriend((prev) => ({
      ...prev,
      [senderId]: (prev[senderId] ?? 0) + 1,
    }));

    if (!settings.sounds.enabled.message) {
      return;
    }

    messageAudio.setVolume(settings.sounds.volume);
    messageAudio.play();
  });

  const blocksParentDialogClose = session !== null || openingPeer !== null || closeGuard;

  return {
    session,
    openingPeer,
    isOpening: openMutation.isPending,
    dmUnread,
    getFriendUnread,
    blocksParentDialogClose,
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
