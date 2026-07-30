'use client';

import { clsx } from 'clsx';
import { HeadphoneOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { DeafenedBadgeProps } from './DeafenedBadge.types';

import s from './DeafenedBadge.module.scss';

export const DeafenedBadge = ({ className }: DeafenedBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('deafened')}
      className={clsx(s.root, className)}
      role='img'
      title={t('deafened')}
    >
      <HeadphoneOff className={s.icon} />
    </span>
  );
};
