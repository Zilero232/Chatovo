'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/entities/auth/user';
import { appEvents } from '@/shared/lib';

export const useChatUnread = (roomId: string, isOpen: boolean) => {
  const { user } = useCurrentUser();

  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
    }
  }, [isOpen]);

  appEvents.on.chatMessage(({ roomId: eventRoomId, senderId }) => {
    if (eventRoomId !== roomId || isOpen || senderId === user?.id) {
      return;
    }

    setUnread((prev) => prev + 1);
  });

  return unread;
};
