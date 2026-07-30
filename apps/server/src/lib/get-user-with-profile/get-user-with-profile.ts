import { isNullish } from 'remeda';

import type { UserWithProfile } from '../../modules/users';

import { AppNotFoundException } from '../../common/exceptions';
import { basePrisma as prisma } from '../../core';
import { userWithProfileInclude } from '../selectors';

export const getUserWithProfileOrThrow = async (userId: string): Promise<UserWithProfile> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: userWithProfileInclude
  });

  if (isNullish(user)) {
    throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
  }

  return user;
};
