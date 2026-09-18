'use client';

import { useEffect } from 'react';

import { useChannelActivity, useMarkChannelRead } from '@/entities/server/channel';

/** Marks the open channel read on entry and again whenever a new message lands while it is open. */
export const useMarkReadOnView = ({
  serverId,
  channelId
}: {
  serverId: string;
  channelId: string;
}) => {
  const markReadMutation = useMarkChannelRead(serverId);
  const activity = useChannelActivity(channelId);

  useEffect(() => {
    const timer = setTimeout(() => markReadMutation.mutate({ channelId }), 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react/exhaustive-deps -- fires on channel switch and on new activity; mutate is a stable ref
  }, [channelId, activity]);
};
