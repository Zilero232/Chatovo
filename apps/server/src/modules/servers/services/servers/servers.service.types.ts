import type { CreateServerRequest, UpdateServerRequest } from '@chatovo/schemas';

export type CreateServerInput = {
  input: CreateServerRequest;
  ownerId: string;
};

export type GetServerInput = {
  serverId: string;
  userId: string;
};

export type UpdateServerInput = {
  serverId: string;
  input: UpdateServerRequest;
  userId: string;
};

export type DeleteServerInput = {
  serverId: string;
  userId: string;
};

export type LeaveServerInput = {
  serverId: string;
  userId: string;
};

export type UploadedServerIcon = {
  buffer: Buffer;
  mimetype: string;
  size: number;
};

export type UpdateServerIconInput = {
  serverId: string;
  file: UploadedServerIcon;
  userId: string;
};
