import { isNonNullish } from 'remeda';

import { AppForbiddenException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';

/** True when the account has been blocked by a moderator. */
export const isUserBlocked = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { blockedAt: true }
  });

  return isNonNullish(user?.blockedAt);
};

/** Throws when the account is blocked, so a banned user cannot reach rooms, chat or voice. */
export const assertNotBlocked = async (userId: string): Promise<void> => {
  if (await isUserBlocked(userId)) {
    throw new AppForbiddenException('USER_BLOCKED', 'Account is blocked');
  }
};
