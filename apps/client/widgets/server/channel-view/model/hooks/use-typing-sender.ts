'use client';

import { useThrottleCallback } from '@siberiacancode/reactuse';

import { useRealtime } from '@/entities/app/realtime';

const TYPING_THROTTLE_MS = 3000;

export const useTypingSender = ({
  channelId,
  threadId
}: {
  channelId: string;
  threadId: string | null;
}) => {
  const { send } = useRealtime();

  return useThrottleCallback(() => {
    send({ op: 'channel.typing', channelId, threadId });
  }, TYPING_THROTTLE_MS);
};
