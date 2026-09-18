import type { Prisma } from '../../../../../generated';
import type {
  serverInviteSelect,
  serverMemberSelect,
  serverRoleSelect,
  serverSelect
} from '../../../../lib';

export type ServerRow = Prisma.ServerGetPayload<{ select: typeof serverSelect }>;
export type ServerRoleRow = Prisma.ServerRoleGetPayload<{ select: typeof serverRoleSelect }>;
export type ServerMemberRow = Prisma.ServerMemberGetPayload<{ select: typeof serverMemberSelect }>;
export type ServerInviteRow = Prisma.ServerInviteGetPayload<{ select: typeof serverInviteSelect }>;
export type ServerBanRow = Prisma.ServerBanGetPayload<{
  select: {
    id: true;
    serverId: true;
    userId: true;
    reason: true;
    bannedById: true;
    createdAt: true;
    user: { select: { name: true; profile: { select: { displayName: true; avatarUrl: true } } } };
  };
}>;
