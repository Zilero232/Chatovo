import type { CreateRoleRequest, ReorderRolesRequest, UpdateRoleRequest } from '@chatovo/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { secondsToMilliseconds } from 'date-fns';
import { isNonNullish } from 'remeda';

import {
  createServerRole,
  deleteServerRole,
  listServerRoles,
  reorderServerRoles,
  updateServerRole
} from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useServerRoles = (serverId: string | null) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.serverRoles(serverId as string),
    queryFn: () => listServerRoles(serverId as string),
    enabled: isNonNullish(serverId),
    staleTime: secondsToMilliseconds(30)
  });

  return { roles: data ?? [], isLoading, isError };
};

const useRolesInvalidation = (serverId: string) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverRoles(serverId) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
  };
};

export const useCreateRole = (serverId: string) => {
  const invalidate = useRolesInvalidation(serverId);

  return useMutation({
    mutationFn: (input: CreateRoleRequest) => createServerRole(serverId, input),
    onSuccess: invalidate
  });
};

export const useUpdateRole = (serverId: string) => {
  const invalidate = useRolesInvalidation(serverId);

  return useMutation({
    mutationFn: ({ roleId, input }: { roleId: string; input: UpdateRoleRequest }) =>
      updateServerRole(serverId, roleId, input),
    onSuccess: invalidate
  });
};

export const useDeleteRole = (serverId: string) => {
  const invalidate = useRolesInvalidation(serverId);

  return useMutation({
    mutationFn: (roleId: string) => deleteServerRole(serverId, roleId),
    onSuccess: invalidate
  });
};

export const useReorderRoles = (serverId: string) => {
  const invalidate = useRolesInvalidation(serverId);

  return useMutation({
    mutationFn: (input: ReorderRolesRequest) => reorderServerRoles(serverId, input),
    onSuccess: invalidate
  });
};
