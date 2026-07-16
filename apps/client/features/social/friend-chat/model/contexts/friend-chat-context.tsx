'use client';

import { createContextHook } from '@siberiacancode/reactuse';
import { useEffect, useEffectEvent } from 'react';

import { useFriendChatSession, useFriendChatUnread } from '../hooks';

import type { ReactNode } from 'react';

const useFriendChatState = () => {
  const { session, openingPeer, isOpening, blocksParentDialogClose, open, close } =
    useFriendChatSession();

  const { dmUnread, getFriendUnread, clearFriendUnread } = useFriendChatUnread({
    openRoomId: session?.roomId ?? null,
  });

  const clearPeerUnread = useEffectEvent((friendId: string) => {
    clearFriendUnread(friendId);
  });

  useEffect(() => {
    if (session?.peer.id) {
      clearPeerUnread(session.peer.id);
    }
  }, [session?.peer.id]);

  return {
    session,
    openingPeer,
    isOpening,
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
