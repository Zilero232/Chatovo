import { isNullish } from 'remeda';

import { prisma } from '../core';

const normalizeTagSeed = (name: string): string => {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 12);

  return cleaned.length > 0 ? cleaned : 'user';
};

const randomDiscriminator = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const buildFriendTag = (name: string): string => {
  return `${normalizeTagSeed(name)}#${randomDiscriminator()}`;
};

export const issueUniqueFriendTag = async (name: string): Promise<string> => {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const friendTag = buildFriendTag(name);
    const existing = await prisma.user.findUnique({
      where: { friendTag },
      select: { id: true },
    });

    if (!existing) {
      return friendTag;
    }
  }

  throw new Error('Unable to generate unique friend tag');
};

export const ensureUserFriendTag = async (userId: string, name: string): Promise<void> => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { friendTag: true },
  });

  if (existing?.friendTag) {
    return;
  }

  const friendTag = await issueUniqueFriendTag(name);

  await prisma.user.update({
    where: { id: userId },
    data: { friendTag },
  });
};

export const backfillMissingFriendTags = async (): Promise<void> => {
  const users = await prisma.$queryRaw<Array<{ id: string; name: string }>>`
    SELECT id, name
    FROM "user"
    WHERE "friendTag" IS NULL
  `;

  for (const user of users) {
    if (isNullish(user.id) || isNullish(user.name)) {
      continue;
    }

    await ensureUserFriendTag(user.id, user.name);
  }
};
