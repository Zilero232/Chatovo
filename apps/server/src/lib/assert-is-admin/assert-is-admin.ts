import { USER_ROLE } from '@chatovo/schemas';
import { isNullish } from 'remeda';

import { AppForbiddenException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';

/** Throws unless the user carries the admin role — the gate for every moderation route. */
export const assertIsAdmin = async (userId: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (isNullish(user) || user.role !== USER_ROLE.admin) {
    throw new AppForbiddenException('ADMIN_ONLY', 'Admin only');
  }
};
