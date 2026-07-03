'use client';

import { useEffect, useState } from 'react';
import { useRealtimeMessage } from '@/entities/app/realtime';
import { useCurrentUser } from '@/entities/auth/user';

export const useChatUnread = (roomId: string, isOpen: boolean) => {
  const { user } = useCurrentUser();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
    }
  }, [isOpen]);

  useRealtimeMessage((message) => {
    if (message.type !== 'chat.message' || message.roomId !== roomId || isOpen) {
      return;
    }

    if (message.message.senderId === user?.id) {
      return;
    }

    setUnread((prev) => prev + 1);
  });

  return unread;
};
