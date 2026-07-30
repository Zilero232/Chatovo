import type { EnsureUserFriendTagInput } from './ensure-user-friend-tag.types';

import { basePrisma as prisma } from '../../core';
import { issueUniqueFriendTag } from '../issue-friend-tag';

export const ensureUserFriendTag = async ({
  userId,
  name,
  currentFriendTag
}: EnsureUserFriendTagInput) => {
  if (currentFriendTag) {
    return currentFriendTag;
  }

  const friendTag = await issueUniqueFriendTag(name);

  await prisma.user.update({
    where: { id: userId },
    data: { friendTag }
  });

  return friendTag;
};
