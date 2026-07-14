'use client';

import { clsx } from 'clsx';
import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './OwnerCrown.module.scss';

import type { OwnerCrownProps } from './OwnerCrown.types';

export const OwnerCrown = ({ className }: OwnerCrownProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('ownerTooltip')}
      className={clsx(s.root, className)}
      role="img"
      title={t('ownerTooltip')}
    >
      <Crown className={s.icon} />
    </span>
  );
};
