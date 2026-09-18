import type {
  CreateCategoryRequest,
  ReorderCategoriesRequest,
  UpdateCategoryRequest
} from '@chatovo/schemas';

export type CreateCategoryInput = {
  serverId: string;
  input: CreateCategoryRequest;
  userId: string;
};

export type UpdateCategoryInput = {
  serverId: string;
  categoryId: string;
  input: UpdateCategoryRequest;
  userId: string;
};

export type DeleteCategoryInput = {
  serverId: string;
  categoryId: string;
  userId: string;
};

export type ReorderCategoriesInput = {
  serverId: string;
  input: ReorderCategoriesRequest;
  userId: string;
};
