'use client';

import type { PutOverwriteRequest } from '@chatovo/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import {
  deleteChannelOverwrite,
  listCategoryOverwrites,
  listChannelOverwrites,
  putCategoryOverwrite,
  putChannelOverwrite
} from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useChannelOverwrites = (channelId: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.channelOverwrites(channelId as string),
    queryFn: () => listChannelOverwrites(channelId as string),
    enabled: isNonNullish(channelId)
  });

  return { overwrites: data ?? [], isLoading };
};

export const usePutChannelOverwrite = ({
  serverId,
  channelId
}: {
  serverId: string;
  channelId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PutOverwriteRequest) => putChannelOverwrite(channelId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelOverwrites(channelId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useDeleteChannelOverwrite = ({
  serverId,
  channelId
}: {
  serverId: string;
  channelId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (overwriteId: string) => deleteChannelOverwrite(channelId, overwriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelOverwrites(channelId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useCategoryOverwrites = ({
  serverId,
  categoryId
}: {
  serverId: string;
  categoryId: string | null;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.categoryOverwrites(categoryId as string),
    queryFn: () => listCategoryOverwrites(serverId, categoryId as string),
    enabled: isNonNullish(categoryId)
  });

  return { overwrites: data ?? [], isLoading };
};

export const usePutCategoryOverwrite = ({
  serverId,
  categoryId
}: {
  serverId: string;
  categoryId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PutOverwriteRequest) => putCategoryOverwrite(serverId, categoryId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categoryOverwrites(categoryId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};
