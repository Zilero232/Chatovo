import type { FriendshipRelation } from '@chatovo/schemas';

export type FriendProfileActionsBodyProps = {
  avatarUrl: string | null;
  displayName: string;
  friendTag: string;
  state: FriendshipRelation;
  userId: string;
  verified: boolean;
};
