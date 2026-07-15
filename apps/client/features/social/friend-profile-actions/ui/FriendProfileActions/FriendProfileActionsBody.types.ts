import type { FriendshipRelation } from '@chatovo/schemas';

export type FriendProfileActionsBodyProps = {
  state: FriendshipRelation;
  userId: string;
  friendTag: string;
  displayName: string;
  avatarUrl: string | null;
  verified: boolean;
};
