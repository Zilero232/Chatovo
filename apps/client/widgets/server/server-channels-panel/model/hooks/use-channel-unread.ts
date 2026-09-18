'use client';

import { useState } from 'react';
import { isNonNullish } from 'remeda';

import { useChannelActivity, useReadStates } from '@/entities/server/channel';

export const useChannelUnread = ({
  serverId,
  channelId
}: {
  serverId: string;
  channelId: string;
}) => {
  const { byChannel } = useReadStates(serverId);
  const activity = useChannelActivity(channelId);

  const [mountedAt] = useState(() => Date.now());

  const state = byChannel.get(channelId);
  const lastReadAt = state ? new Date(state.lastReadAt).getTime() : 0;
  const isMuted =
    isNonNullish(state?.mutedUntil) && new Date(state.mutedUntil).getTime() > mountedAt;

  const hasUnread =
    (state?.hasUnread ?? false) || (isNonNullish(activity) && activity > lastReadAt);

  return { hasUnread: hasUnread && !isMuted, isMuted };
};
