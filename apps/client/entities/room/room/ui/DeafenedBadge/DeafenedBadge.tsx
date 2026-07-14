'use client';

import { clsx } from 'clsx';
import { HeadphoneOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import s from './DeafenedBadge.module.scss';
import type { DeafenedBadgeProps } from './DeafenedBadge.types';

export const DeafenedBadge = ({ className }: DeafenedBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('deafened')}
      className={clsx(s.root, className)}
      role="img"
      title={t('deafened')}
    >
      <HeadphoneOff className={s.icon} />
    </span>
  );
};
