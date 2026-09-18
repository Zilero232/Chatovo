import type {
  CreateCategoryRequest,
  ReorderCategoriesRequest,
  UpdateCategoryRequest
} from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCategory, deleteCategory, reorderCategories, updateCategory } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useCreateCategory = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryRequest) => createCategory(serverId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useUpdateCategory = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, input }: { categoryId: string; input: UpdateCategoryRequest }) =>
      updateCategory(serverId, categoryId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useDeleteCategory = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(serverId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};

export const useReorderCategories = (serverId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReorderCategoriesRequest) => reorderCategories(serverId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    }
  });
};
