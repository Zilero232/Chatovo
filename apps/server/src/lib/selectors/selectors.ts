import type { Prisma } from '../../../generated';

export const roomSelect = {
  id: true,
  name: true,
  kind: true,
  isPrivate: true,
  serverId: true,
  ownerId: true
} satisfies Prisma.RoomSelect;

/** The fields `canAccessRoom` needs; shared by every room-access guard. */
export const roomAccessSelect = {
  id: true,
  kind: true,
  isPrivate: true,
  ownerId: true,
  serverId: true,
  dmUserAId: true,
  dmUserBId: true
} satisfies Prisma.RoomSelect;

export const senderSelect = {
  select: { name: true, profile: { select: { displayName: true } } }
} as const;

export const userWithProfileInclude = { profile: true } satisfies Prisma.UserInclude;
