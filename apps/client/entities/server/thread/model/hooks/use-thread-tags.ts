'use client';

import type { CreateThreadTagRequest } from '@chatovo/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import { createThreadTag, deleteThreadTag, listThreadTags } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useThreadTags = (channelId: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.channelThreadTags(channelId as string),
    queryFn: () => listThreadTags(channelId as string),
    enabled: isNonNullish(channelId)
  });

  const tags = data ?? [];

  return { tags, byId: new Map(tags.map((tag) => [tag.id, tag])), isLoading };
};

const useTagsInvalidation = (channelId: string) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelThreadTags(channelId) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelThreads(channelId, false) });
  };
};

export const useCreateThreadTag = (channelId: string) => {
  const invalidate = useTagsInvalidation(channelId);

  return useMutation({
    mutationFn: (input: CreateThreadTagRequest) => createThreadTag(channelId, input),
    onSuccess: invalidate
  });
};

export const useDeleteThreadTag = (channelId: string) => {
  const invalidate = useTagsInvalidation(channelId);

  return useMutation({
    mutationFn: deleteThreadTag,
    onSuccess: invalidate
  });
};
