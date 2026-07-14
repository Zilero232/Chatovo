'use client';

import { clsx } from 'clsx';
import { MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './MicMutedBadge.module.scss';

import type { MicMutedBadgeProps } from './MicMutedBadge.types';

export const MicMutedBadge = ({ className }: MicMutedBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('micMuted')}
      className={clsx(s.root, className)}
      role="img"
      title={t('micMuted')}
    >
      <MicOff className={s.icon} />
    </span>
  );
};
