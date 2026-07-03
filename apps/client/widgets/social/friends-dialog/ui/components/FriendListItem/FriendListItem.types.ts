import type { FriendUser } from '@chatovo/schemas';
import type { ReactNode } from 'react';

export type FriendListItemProps = {
  user: FriendUser;
  actions?: ReactNode;
};
