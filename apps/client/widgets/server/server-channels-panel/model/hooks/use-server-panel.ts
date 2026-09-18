'use client';

import { useSearchParams } from 'next/navigation';

import { canOnServer, useChannelTree } from '@/entities/server/channel';
import { useServerById } from '@/entities/server/server';

export const useServerPanel = () => {
  const params = useSearchParams();

  const serverId = params.get('id');
  const activeChannelId = params.get('channel');

  const { server } = useServerById(serverId);
  const { tree, groups, isLoading } = useChannelTree(serverId);

  return {
    serverId,
    activeChannelId,
    server,
    tree,
    groups,
    isLoading,
    canManageChannels: canOnServer(tree, 'manageChannels')
  };
};
