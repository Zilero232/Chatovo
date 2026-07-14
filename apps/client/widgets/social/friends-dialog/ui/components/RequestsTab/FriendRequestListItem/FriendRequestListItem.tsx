'use client';

import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UserAvatar, UserName } from '@/entities/auth/user';
import { Button } from '@/shared/ui';
import s from './FriendRequestListItem.module.scss';
import type { FriendRequestListItemProps } from './FriendRequestListItem.types';

export const FriendRequestListItem = ({
  entry,
  isAccepting,
  isDeclining,
  onAccept,
  onDecline,
}: FriendRequestListItemProps) => {
  const t = useTranslations('friends');
  const { user } = entry;
  const busy = isAccepting || isDeclining;

  return (
    <div className={s.root}>
      <UserAvatar name={user.name} size="sm" src={user.avatarUrl} />
      <div className={s.info}>
        <UserName className={s.name} name={user.name} verified={user.verified} />
        {user.friendTag && <p className={s.tag}>{user.friendTag}</p>}
      </div>
      <div className={s.actions}>
        <Button className={s.action} disabled={busy} size="sm" onClick={onAccept}>
          <Check aria-hidden />
          {t('accept')}
        </Button>
        <Button
          className={s.action}
          disabled={busy}
          size="sm"
          variant="secondary"
          onClick={onDecline}
        >
          <X aria-hidden />
          {t('decline')}
        </Button>
      </div>
    </div>
  );
};
