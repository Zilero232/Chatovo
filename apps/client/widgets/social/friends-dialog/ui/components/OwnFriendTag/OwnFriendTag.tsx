'use client';

import { useTranslations } from 'next-intl';

import { useCurrentUser } from '@/entities/auth/user';
import { FriendTag } from '@/entities/social/friend';

import s from '../../FriendsDialog.module.scss';

export const OwnFriendTag = () => {
  const t = useTranslations('friends');
  const { friendTag } = useCurrentUser();

  if (!friendTag) {
    return null;
  }

  return (
    <div className={s.ownTagRow}>
      <span className={s.ownTagLabel}>{t('yourTagLabel')}</span>
      <FriendTag tag={friendTag} />
    </div>
  );
};
