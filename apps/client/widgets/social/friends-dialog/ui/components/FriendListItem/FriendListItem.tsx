'use client';

import { ChevronRight, MoreVertical, UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { UserAvatar, UserName } from '@/entities/auth/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui';

import s from './FriendListItem.module.scss';

import type { FriendListItemProps } from './FriendListItem.types';

export const FriendListItem = ({ user, dmUnread = 0, onOpen, onRemove }: FriendListItemProps) => {
  const t = useTranslations('friends');

  return (
    <div className={s.root}>
      <button className={s.main} type="button" onClick={() => onOpen(user)}>
        <UserAvatar className={s.avatar} name={user.name} size="sm" src={user.avatarUrl} />
        <div className={s.info}>
          <UserName className={s.name} name={user.name} verified={user.verified} />
          {user.friendTag && <p className={s.tag}>{user.friendTag}</p>}
        </div>
        {dmUnread > 0 && (
          <span
            aria-live="polite"
            className={s.unread}
            title={t('unreadMessages', { count: dmUnread })}
          >
            {dmUnread > 99 ? '99+' : dmUnread}
          </span>
        )}
        <ChevronRight aria-hidden className={s.chevron} />
      </button>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label={t('friendActions')}
          className={s.menuTrigger}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className={s.menuItemDestructive} onClick={() => onRemove(user)}>
            <UserMinus />
            {t('removeFriend')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
