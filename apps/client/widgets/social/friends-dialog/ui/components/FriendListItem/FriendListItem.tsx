'use client';

import { UserAvatar, UserName } from '@/entities/auth/user';
import { friendListItemStyles as s } from './FriendListItem.styles';
import type { FriendListItemProps } from './FriendListItem.types';

export const FriendListItem = ({ user, actions }: FriendListItemProps) => {
  return (
    <div className={s.root}>
      <div className={s.profile}>
        <UserAvatar name={user.name} size="sm" src={user.avatarUrl} />
        <div className={s.info}>
          <UserName className={s.name} name={user.name} verified={user.verified} />
          {user.friendTag && <p className={s.tag}>{user.friendTag}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
};
