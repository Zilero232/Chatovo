import { useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';
import { isEmpty } from 'remeda';

import { listServers } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useServers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.servers(),
    queryFn: listServers,
    staleTime: secondsToMilliseconds(30)
  });

  const servers = data ?? [];

  return {
    servers,
    isLoading,
    isError,
    isEmpty: !isLoading && isEmpty(servers)
  };
};
