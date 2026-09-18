'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { isNonNullish, isNullish } from 'remeda';

import { useChannelTree, useLastChannel } from '@/entities/server/channel';
import { useServerById } from '@/entities/server/server';
import { ROUTES } from '@/shared/constants';
import { buildServerHref } from '@/shared/lib';

export const useServerPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const serverId = params.get('id');
  const channelId = params.get('channel');
  const threadId = params.get('thread');

  const { server, isLoading: isServerLoading, isError } = useServerById(serverId);
  const { tree, isLoading: isTreeLoading } = useChannelTree(serverId);
  const { rememberChannel } = useLastChannel(serverId);

  const channel = tree?.channels.find((item) => item.id === channelId) ?? null;

  useEffect(() => {
    if (!serverId) {
      router.replace(ROUTES.lobby);
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect only when the id disappears; router is a stable ref
  }, [serverId]);

  useEffect(() => {
    if (isNullish(serverId) || isNullish(tree) || isNonNullish(channel)) {
      return;
    }

    const fallback =
      tree.channels.find((item) => item.type === 'text') ?? tree.channels.at(0) ?? null;

    if (fallback) {
      router.replace(buildServerHref(serverId, { channelId: fallback.id }));
    }
    // eslint-disable-next-line react/exhaustive-deps -- pick a fallback once the tree arrives without a valid channel; router is a stable ref
  }, [serverId, tree, channel]);

  useEffect(() => {
    if (channel) {
      rememberChannel(channel.id);
    }
    // eslint-disable-next-line react/exhaustive-deps -- remember only when the channel changes; rememberChannel reads fresh storage
  }, [channel?.id]);

  return {
    serverId,
    server,
    tree,
    channel,
    threadId,
    isLoading: isServerLoading || isTreeLoading,
    isError
  };
};
