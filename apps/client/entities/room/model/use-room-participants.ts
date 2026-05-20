import { useQuery } from '@tanstack/react-query';

import { fetchRoomParticipants } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

const REFRESH_MS = 5_000;

export const useRoomParticipants = (roomId: string | null, enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.roomParticipants(roomId ?? ''),
    queryFn: () => fetchRoomParticipants(roomId as string),
    enabled: !!roomId && enabled,
    refetchInterval: REFRESH_MS,
    select: ({ participants }) => participants,
  });
