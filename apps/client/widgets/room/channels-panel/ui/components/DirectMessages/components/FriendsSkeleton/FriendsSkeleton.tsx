'use client';

import { Skeleton } from '@/ui-kit';

import s from './FriendsSkeleton.module.scss';

const SKELETON_KEYS = ['a', 'b', 'c', 'd'] as const;

export const FriendsSkeleton = () => (
  <div className={s.root}>
    {SKELETON_KEYS.map((key) => (
      <Skeleton key={key} className={s.item} />
    ))}
  </div>
);
