'use client';

import { useEffect, useEffectEvent } from 'react';
import { subscribeRealtimeMessage } from '../lib/message-listeners';
import type { RealtimeServerMessage } from '@chatovo/schemas';

export const useRealtimeMessage = (handler: (message: RealtimeServerMessage) => void) => {
  const onMessage = useEffectEvent((message: RealtimeServerMessage) => {
    handler(message);
  });

  useEffect(() => {
    return subscribeRealtimeMessage(onMessage);
  }, []);
};
