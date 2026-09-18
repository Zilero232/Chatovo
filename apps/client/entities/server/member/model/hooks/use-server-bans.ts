'use client';

import type { BanMemberRequest } from '@chatovo/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import { banServerMember, listServerBans, unbanServerMember } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useServerBans = (serverId: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.serverBans(serverId as string),
    queryFn: () => listServerBans(serverId as string),
    enabled: isNonNullish(serverId)
  });

  return { bans: data ?? [], isLoading };
};

const useBansInvalidation = (serverId: string) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverBans(serverId) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverMembers(serverId) });
  };
};

export const useBanMember = (serverId: string) => {
  const invalidate = useBansInvalidation(serverId);

  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: BanMemberRequest }) =>
      banServerMember(serverId, userId, input),
    onSuccess: invalidate
  });
};

export const useUnbanMember = (serverId: string) => {
  const invalidate = useBansInvalidation(serverId);

  return useMutation({
    mutationFn: (userId: string) => unbanServerMember(serverId, userId),
    onSuccess: invalidate
  });
};
