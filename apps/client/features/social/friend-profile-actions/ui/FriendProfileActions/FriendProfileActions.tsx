'use client';

import { useFriendshipRelation } from '@/entities/social/friend';
import { Spinner } from '@/shared/ui';
import { FriendProfileActionsBody } from './FriendProfileActionsBody';

import s from './FriendProfileActions.module.scss';

import type { FriendProfileActionsProps } from './FriendProfileActions.types';

export const FriendProfileActions = ({
  userId,
  friendTag,
  displayName,
  avatarUrl = null,
  verified = false,
}: FriendProfileActionsProps) => {
  const { data: relation, isPending: isRelationPending } = useFriendshipRelation(userId);

  if (isRelationPending) {
    return (
      <div className={s.root}>
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className={s.root}>
      <FriendProfileActionsBody
        avatarUrl={avatarUrl}
        displayName={displayName}
        friendTag={friendTag}
        state={relation ?? { status: 'none' }}
        userId={userId}
        verified={verified}
      />
    </div>
  );
};
