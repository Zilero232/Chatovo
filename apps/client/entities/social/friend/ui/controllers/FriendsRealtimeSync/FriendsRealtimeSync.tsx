'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { useRealtimeMessage } from '@/entities/app/realtime';
import { applyFriendPresence, applyFriendsSnapshot } from '../../../model/lib';

export const FriendsRealtimeSync = () => {
  const queryClient = useQueryClient();
  const friendsEpochRef = useRef<number | undefined>(undefined);

  useRealtimeMessage((message) => {
    if (message.type === 'friend.presence') {
      applyFriendPresence(queryClient, message.userId, message.isOnline);

      return;
    }

    if (message.type !== 'friends.snapshot') {
      return;
    }

    applyFriendsSnapshot(queryClient, message.snapshot, friendsEpochRef);
  });

  return null;
};
