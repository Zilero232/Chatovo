import { FriendshipStatus } from '../../../generated';
import { userWithProfileInclude } from '../../lib/selectors';
import { hasUserConnection } from '../realtime/connection-store';
import { toUserProfile, type UserWithProfile } from '../users/profile';

import type { FriendshipRelation, FriendUser } from '@chatovo/schemas';

export const friendshipInclude = {
  requester: { include: userWithProfileInclude },
  addressee: { include: userWithProfileInclude },
} as const;

export const normalizeFriendTag = (tag: string) => {
  return tag.trim().toLowerCase();
};

export const toFriendUser = (user: UserWithProfile): FriendUser => {
  const profile = toUserProfile(user);

  return {
    id: profile.id,
    name: profile.name,
    friendTag: profile.friendTag,
    avatarUrl: profile.avatarUrl,
    verified: profile.verified,
    isOnline: hasUserConnection(profile.id),
  };
};

export const otherUser = (
  row: {
    requesterId: string;
    requester: UserWithProfile;
    addressee: UserWithProfile;
  },
  userId: string,
): UserWithProfile => {
  return row.requesterId === userId ? row.addressee : row.requester;
};

export const toRelation = (
  row: { id: string; status: string; requesterId: string },
  userId: string,
): FriendshipRelation => {
  if (row.status === FriendshipStatus.accepted) {
    return { status: 'friends', friendshipId: row.id };
  }

  if (row.requesterId === userId) {
    return { status: 'outgoing_pending', friendshipId: row.id };
  }

  return { status: 'incoming_pending', friendshipId: row.id };
};
