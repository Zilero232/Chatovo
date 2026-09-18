import type {
  CreateChannelRequest,
  ReorderChannelsRequest,
  UpdateChannelRequest
} from '@chatovo/schemas';

export type GetChannelTreeInput = {
  serverId: string;
  userId: string;
};

export type GetChannelInput = {
  channelId: string;
  userId: string;
};

export type CreateChannelInput = {
  serverId: string;
  input: CreateChannelRequest;
  userId: string;
};

export type UpdateChannelInput = {
  channelId: string;
  input: UpdateChannelRequest;
  userId: string;
};

export type DeleteChannelInput = {
  channelId: string;
  userId: string;
};

export type ReorderChannelsInput = {
  serverId: string;
  input: ReorderChannelsRequest;
  userId: string;
};
