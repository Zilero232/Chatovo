import { useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';
import { isNonNullish } from 'remeda';

import { fetchChannelTree } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { groupChannels } from '../../lib/group-channels';

export const useChannelTree = (serverId: string | null) => {
  const {
    data: tree,
    isLoading,
    isError
  } = useQuery({
    queryKey: QUERY_KEYS.channelTree(serverId),
    queryFn: () => fetchChannelTree(serverId as string),
    enabled: isNonNullish(serverId),
    staleTime: secondsToMilliseconds(30)
  });

  const groups = isNonNullish(tree)
    ? groupChannels({ categories: tree.categories, channels: tree.channels })
    : [];

  return { tree, groups, isLoading, isError };
};
