'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { OwnerBadgeProps } from './OwnerBadge.types';

import s from './OwnerBadge.module.scss';

export const OwnerBadge = ({ className }: OwnerBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <Badge className={className} tone='amber'>
      <Crown className={s.icon} />
      {t('yours')}
    </Badge>
  );
};
