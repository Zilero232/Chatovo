import { useQuery } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';
import { isNonNullish } from 'remeda';

import { listServerMembers } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useServerMembers = (serverId: string | null) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.serverMembers(serverId as string),
    queryFn: () => listServerMembers(serverId as string),
    enabled: isNonNullish(serverId),
    staleTime: secondsToMilliseconds(30)
  });

  return { members: data ?? [], isLoading, isError };
};
