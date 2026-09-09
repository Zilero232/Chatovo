'use client';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import s from '../../ChannelsFriends.module.scss';

const FRIENDS_SKELETON_KEYS = ['a', 'b', 'c'] as const;

export const FriendsSkeleton = () => {
  const t = useTranslations('channels.friends');

  return (
    <div className={s.group}>
      <p className={s.sectionLabel}>{t('heading')}</p>
      {FRIENDS_SKELETON_KEYS.map((key) => (
        <Skeleton key={key} className={s.skeletonItem} />
      ))}
    </div>
  );
};
