'use client';

import { MessageSquare, Phone, UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui';
import { friendListActionsStyles as s } from './FriendListActions.styles';
import type { FriendListActionsProps } from './FriendListActions.types';

export const FriendListActions = ({
  user,
  isCallPending,
  onMessage,
  onCall,
  onRemove,
}: FriendListActionsProps) => {
  const t = useTranslations('friends');

  return (
    <div className={s.root}>
      <div className={s.primary}>
        <Button className={s.action} size="sm" variant="outline" onClick={() => onMessage(user)}>
          <MessageSquare aria-hidden />
          {t('messageFriend')}
        </Button>

        <Button
          className={s.action}
          disabled={isCallPending}
          size="sm"
          onClick={() => onCall(user.id)}
        >
          <Phone aria-hidden />
          {t('callFriend')}
        </Button>
      </div>

      <Button className={s.remove} size="sm" variant="ghost" onClick={() => onRemove(user)}>
        <UserMinus aria-hidden />
        {t('removeFriend')}
      </Button>
    </div>
  );
};
