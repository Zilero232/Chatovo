'use client';

import { useState } from 'react';
import { isNonNullish } from 'remeda';

import { useReadStates } from '@/entities/server/channel';

export const useServerUnread = (serverId: string) => {
  const { states } = useReadStates(serverId);

  const [mountedAt] = useState(() => Date.now());

  return states.some((state) => {
    const isMuted =
      isNonNullish(state.mutedUntil) && new Date(state.mutedUntil).getTime() > mountedAt;

    return state.hasUnread && !isMuted;
  });
};
