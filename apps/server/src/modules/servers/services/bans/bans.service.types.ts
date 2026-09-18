import type { BanMemberRequest } from '@chatovo/schemas';

export type ListBansInput = {
  serverId: string;
  userId: string;
};

export type BanMemberInput = {
  serverId: string;
  targetUserId: string;
  input: BanMemberRequest;
  userId: string;
};

export type UnbanMemberInput = {
  serverId: string;
  targetUserId: string;
  userId: string;
};
