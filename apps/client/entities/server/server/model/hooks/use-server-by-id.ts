import { useQuery } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import { getServer } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useServerById = (serverId: string | null) => {
  const {
    data: server,
    isLoading,
    isError
  } = useQuery({
    queryKey: QUERY_KEYS.server(serverId),
    queryFn: () => getServer(serverId as string),
    enabled: isNonNullish(serverId),
    retry: false
  });

  return { server, isLoading, isError };
};
