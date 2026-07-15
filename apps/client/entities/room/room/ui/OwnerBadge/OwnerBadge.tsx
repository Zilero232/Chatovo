'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/ui';

import s from './OwnerBadge.module.scss';

import type { OwnerBadgeProps } from './OwnerBadge.types';

export const OwnerBadge = ({ className }: OwnerBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <Badge className={className} tone="amber">
      <Crown className={s.icon} />
      {t('yours')}
    </Badge>
  );
};
