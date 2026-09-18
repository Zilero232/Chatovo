import type { CreateInviteRequest } from '@chatovo/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import {
  createServerInvite,
  joinServerByInvite,
  listServerInvites,
  previewServerInvite,
  revokeServerInvite
} from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useServerInvites = (serverId: string | null) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.serverInvites(serverId as string),
    queryFn: () => listServerInvites(serverId as string),
    enabled: isNonNullish(serverId)
  });

  return { invites: data ?? [], isLoading, isError };
};

export const useInvitePreview = (code: string | null) => {
  const {
    data: preview,
    isLoading,
    isError
  } = useQuery({
    queryKey: QUERY_KEYS.serverInvitePreview(code as string),
    queryFn: () => previewServerInvite(code as string),
    enabled: isNonNullish(code),
    retry: false
  });

  return { preview, isLoading, isError };
};

export const useCreateInvite = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInviteRequest) => createServerInvite(serverId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverInvites(serverId) });
    }
  });
};

export const useRevokeInvite = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => revokeServerInvite(serverId, inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverInvites(serverId) });
    }
  });
};

export const useJoinServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinServerByInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.servers() });
    }
  });
};
