import type { Prisma } from '../../generated';

export const roomSelect = {
  id: true,
  name: true,
  isPrivate: true,
  ownerId: true,
} satisfies Prisma.RoomSelect;

export const senderSelect = {
  select: { email: true, name: true, profile: { select: { displayName: true } } },
} as const;

export const userWithProfileInclude = { profile: true } satisfies Prisma.UserInclude;
