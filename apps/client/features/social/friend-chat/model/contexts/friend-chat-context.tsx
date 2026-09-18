'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useSearchParams } from 'next/navigation';
import { useEffect, useEffectEvent } from 'react';

import { useFriendChatUnread } from '../hooks';

const useFriendChatState = () => {
  const searchParams = useSearchParams();

  const openPeerId = searchParams.get('user');

  const { dmUnread, getFriendUnread, clearFriendUnread } = useFriendChatUnread({
    openPeerId
  });

  const clearPeerUnread = useEffectEvent((friendId: string) => {
    clearFriendUnread(friendId);
  });

  useEffect(() => {
    if (openPeerId) {
      clearPeerUnread(openPeerId);
    }
  }, [openPeerId]);

  return { dmUnread, getFriendUnread };
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
