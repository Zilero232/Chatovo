import type { UpdateMemberRequest } from '@chatovo/schemas';

export type ListMembersInput = {
  serverId: string;
  userId: string;
};

export type UpdateMemberInput = {
  serverId: string;
  targetUserId: string;
  input: UpdateMemberRequest;
  userId: string;
};

export type KickMemberInput = {
  serverId: string;
  targetUserId: string;
  userId: string;
};
