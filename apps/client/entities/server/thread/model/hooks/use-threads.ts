import type { CreateThreadRequest, UpdateThreadRequest } from '@chatovo/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isNonNullish } from 'remeda';

import { createThread, deleteThread, listThreads, updateThread } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useThreads = ({
  channelId,
  archived = false
}: {
  channelId: string | null;
  archived?: boolean;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.channelThreads(channelId as string, archived),
    queryFn: () => listThreads(channelId as string, archived),
    enabled: isNonNullish(channelId)
  });

  return { threads: data ?? [], isLoading, isError };
};

const useThreadsInvalidation = (channelId: string) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelThreads(channelId, false) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelThreads(channelId, true) });
  };
};

export const useCreateThread = (channelId: string) => {
  const invalidate = useThreadsInvalidation(channelId);

  return useMutation({
    mutationFn: (input: CreateThreadRequest) => createThread(channelId, input),
    onSuccess: invalidate
  });
};

export const useUpdateThread = (channelId: string) => {
  const invalidate = useThreadsInvalidation(channelId);

  return useMutation({
    mutationFn: ({ threadId, input }: { threadId: string; input: UpdateThreadRequest }) =>
      updateThread(threadId, input),
    onSuccess: invalidate
  });
};

export const useDeleteThread = (channelId: string) => {
  const invalidate = useThreadsInvalidation(channelId);

  return useMutation({
    mutationFn: deleteThread,
    onSuccess: invalidate
  });
};
