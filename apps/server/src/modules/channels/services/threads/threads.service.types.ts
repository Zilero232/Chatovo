import type {
  CreateThreadRequest,
  CreateThreadTagRequest,
  UpdateThreadRequest
} from '@chatovo/schemas';

export type ListThreadsInput = {
  channelId: string;
  userId: string;
  includeArchived: boolean;
};

export type CreateThreadInput = {
  channelId: string;
  input: CreateThreadRequest;
  userId: string;
};

export type UpdateThreadInput = {
  threadId: string;
  input: UpdateThreadRequest;
  userId: string;
};

export type DeleteThreadInput = {
  threadId: string;
  userId: string;
};

export type ListThreadTagsInput = {
  channelId: string;
  userId: string;
};

export type CreateThreadTagInput = {
  channelId: string;
  input: CreateThreadTagRequest;
  userId: string;
};

export type DeleteThreadTagInput = {
  tagId: string;
  userId: string;
};
