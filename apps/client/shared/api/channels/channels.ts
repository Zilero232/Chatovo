import type {
  Category,
  Channel,
  ChannelOverwrite,
  ChannelReadState,
  ChannelTree,
  CreateCategoryRequest,
  CreateChannelRequest,
  CreateThreadRequest,
  CreateThreadTagRequest,
  PutOverwriteRequest,
  ReorderCategoriesRequest,
  ReorderChannelsRequest,
  Thread,
  ThreadTag,
  UpdateCategoryRequest,
  UpdateChannelRequest,
  UpdateThreadRequest,
  VoiceChannelRef
} from '@chatovo/schemas';

import { api } from '../http';

export const fetchChannelTree = async (serverId: string): Promise<ChannelTree> => {
  const { data } = await api.get(`/servers/${serverId}/tree`);

  return data;
};

export const listVoiceChannels = async (): Promise<VoiceChannelRef[]> => {
  const { data } = await api.get('/channels/voice');

  return data;
};

export const getChannel = async (channelId: string): Promise<Channel> => {
  const { data } = await api.get(`/channels/${channelId}`);

  return data;
};

export const createChannel = async (
  serverId: string,
  input: CreateChannelRequest
): Promise<Channel> => {
  const { data } = await api.post(`/servers/${serverId}/channels`, input);

  return data;
};

export const updateChannel = async (
  channelId: string,
  input: UpdateChannelRequest
): Promise<Channel> => {
  const { data } = await api.patch(`/channels/${channelId}`, input);

  return data;
};

export const deleteChannel = async (channelId: string): Promise<void> => {
  await api.delete(`/channels/${channelId}`);
};

export const reorderChannels = async (
  serverId: string,
  input: ReorderChannelsRequest
): Promise<{ categories: Category[]; channels: Channel[] }> => {
  const { data } = await api.patch(`/servers/${serverId}/channels/reorder`, input);

  return data;
};

export const createCategory = async (
  serverId: string,
  input: CreateCategoryRequest
): Promise<Category> => {
  const { data } = await api.post(`/servers/${serverId}/categories`, input);

  return data;
};

export const updateCategory = async (
  serverId: string,
  categoryId: string,
  input: UpdateCategoryRequest
): Promise<Category> => {
  const { data } = await api.patch(`/servers/${serverId}/categories/${categoryId}`, input);

  return data;
};

export const deleteCategory = async (serverId: string, categoryId: string): Promise<void> => {
  await api.delete(`/servers/${serverId}/categories/${categoryId}`);
};

export const reorderCategories = async (
  serverId: string,
  input: ReorderCategoriesRequest
): Promise<Category[]> => {
  const { data } = await api.patch(`/servers/${serverId}/categories/reorder`, input);

  return data;
};

export const listChannelOverwrites = async (channelId: string): Promise<ChannelOverwrite[]> => {
  const { data } = await api.get(`/channels/${channelId}/overwrites`);

  return data;
};

export const putChannelOverwrite = async (
  channelId: string,
  input: PutOverwriteRequest
): Promise<ChannelOverwrite> => {
  const { data } = await api.post(`/channels/${channelId}/overwrites`, input);

  return data;
};

export const deleteChannelOverwrite = async (
  channelId: string,
  overwriteId: string
): Promise<void> => {
  await api.delete(`/channels/${channelId}/overwrites/${overwriteId}`);
};

export const listCategoryOverwrites = async (
  serverId: string,
  categoryId: string
): Promise<ChannelOverwrite[]> => {
  const { data } = await api.get(`/servers/${serverId}/categories/${categoryId}/overwrites`);

  return data;
};

export const putCategoryOverwrite = async (
  serverId: string,
  categoryId: string,
  input: PutOverwriteRequest
): Promise<ChannelOverwrite> => {
  const { data } = await api.post(
    `/servers/${serverId}/categories/${categoryId}/overwrites`,
    input
  );

  return data;
};

export const listThreads = async (channelId: string, archived = false): Promise<Thread[]> => {
  const { data } = await api.get(`/channels/${channelId}/threads`, { params: { archived } });

  return data;
};

export const createThread = async (
  channelId: string,
  input: CreateThreadRequest
): Promise<Thread> => {
  const { data } = await api.post(`/channels/${channelId}/threads`, input);

  return data;
};

export const updateThread = async (
  threadId: string,
  input: UpdateThreadRequest
): Promise<Thread> => {
  const { data } = await api.patch(`/threads/${threadId}`, input);

  return data;
};

export const deleteThread = async (threadId: string): Promise<void> => {
  await api.delete(`/threads/${threadId}`);
};

export const listThreadTags = async (channelId: string): Promise<ThreadTag[]> => {
  const { data } = await api.get(`/channels/${channelId}/thread-tags`);

  return data;
};

export const createThreadTag = async (
  channelId: string,
  input: CreateThreadTagRequest
): Promise<ThreadTag> => {
  const { data } = await api.post(`/channels/${channelId}/thread-tags`, input);

  return data;
};

export const deleteThreadTag = async (tagId: string): Promise<void> => {
  await api.delete(`/thread-tags/${tagId}`);
};

export const listReadStates = async (serverId: string): Promise<ChannelReadState[]> => {
  const { data } = await api.get(`/servers/${serverId}/read-states`);

  return data;
};

export const markChannelRead = async (
  channelId: string,
  lastReadAt?: string
): Promise<ChannelReadState> => {
  const { data } = await api.post(`/channels/${channelId}/read`, { lastReadAt });

  return data;
};

export const muteChannel = async (
  channelId: string,
  mutedUntil: string | null
): Promise<ChannelReadState> => {
  const { data } = await api.post(`/channels/${channelId}/mute`, { mutedUntil });

  return data;
};
