import type { UpdateMemberRequest } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { kickServerMember, updateServerMember } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useUpdateMember = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: UpdateMemberRequest }) =>
      updateServerMember(serverId, userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverMembers(serverId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useKickMember = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => kickServerMember(serverId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverMembers(serverId) });
    }
  });
};
