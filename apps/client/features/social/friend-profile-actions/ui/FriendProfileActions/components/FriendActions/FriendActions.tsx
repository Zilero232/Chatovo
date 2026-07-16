'use client';

import { MessageSquare, Phone, UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui';

import s from '../../FriendProfileActions.module.scss';

import type { FriendActionsProps } from './FriendActions.types';

export const FriendActions = ({ isBusy, onOpenChat, onCall, onRemove }: FriendActionsProps) => {
  const t = useTranslations('friends');

  return (
    <div className={s.friendsSection}>
      <div className={s.friendsPrimary}>
        <Button
          className={s.friendsAction}
          disabled={isBusy}
          size="sm"
          variant="outline"
          onClick={onOpenChat}
        >
          <MessageSquare aria-hidden />
          {t('messageFriend')}
        </Button>
        <Button className={s.friendsAction} disabled={isBusy} size="sm" onClick={onCall}>
          <Phone aria-hidden />
          {t('callFriend')}
        </Button>
      </div>
      <Button
        className={s.friendsRemove}
        disabled={isBusy}
        size="sm"
        variant="ghost"
        onClick={onRemove}
      >
        <UserMinus aria-hidden />
        {t('removeFriend')}
      </Button>
    </div>
  );
};
