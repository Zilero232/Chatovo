import type { CreateInviteRequest } from '@chatovo/schemas';

export type ListInvitesInput = {
  serverId: string;
  userId: string;
};

export type CreateInviteInput = {
  serverId: string;
  input: CreateInviteRequest;
  userId: string;
};

export type RevokeInviteInput = {
  serverId: string;
  inviteId: string;
  userId: string;
};

export type PreviewInviteInput = {
  code: string;
  userId: string;
};

export type JoinServerInput = {
  code: string;
  userId: string;
};
