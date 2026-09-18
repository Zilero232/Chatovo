import type { ServerMember } from '@chatovo/schemas';

export type UseMemberActionsOpenDialog = 'ban' | 'kick' | 'nickname' | 'timeout' | null;

export type UseMemberActionsInput = {
  member: ServerMember;
  serverId: string;
};
