'use client';

import { useEffect, useRef, useState } from 'react';
import { useRoomChat } from '../contexts';

export const useChatUnread = (isOpen: boolean) => {
  const { chatMessages } = useRoomChat();
  const readCountRef = useRef(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (isOpen) {
      readCountRef.current = chatMessages.length;
      setUnread(0);
      return;
    }

    setUnread(Math.max(0, chatMessages.length - readCountRef.current));
  }, [isOpen, chatMessages.length]);

  return unread;
};
