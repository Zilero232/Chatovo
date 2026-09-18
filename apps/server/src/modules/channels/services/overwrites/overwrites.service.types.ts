import type { PutOverwriteRequest } from '@chatovo/schemas';

export type ListOverwritesInput = {
  channelId: string;
  userId: string;
};

export type PutOverwriteInput = {
  channelId: string;
  input: PutOverwriteRequest;
  userId: string;
};

export type DeleteOverwriteInput = {
  channelId: string;
  overwriteId: string;
  userId: string;
};

export type ListCategoryOverwritesInput = {
  serverId: string;
  categoryId: string;
  userId: string;
};

export type PutCategoryOverwriteInput = {
  serverId: string;
  categoryId: string;
  input: PutOverwriteRequest;
  userId: string;
};
