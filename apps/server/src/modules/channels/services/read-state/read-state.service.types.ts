import type { MarkChannelReadRequest } from '@chatovo/schemas';

export type ListReadStatesInput = {
  serverId: string;
  userId: string;
};

export type MarkChannelReadInput = {
  channelId: string;
  input: MarkChannelReadRequest;
  userId: string;
};

export type MuteChannelInput = {
  channelId: string;
  mutedUntil: string | null;
  userId: string;
};

export type RecordMentionsInput = {
  at: Date;
  channelId: string;
  userIds: string[];
};
