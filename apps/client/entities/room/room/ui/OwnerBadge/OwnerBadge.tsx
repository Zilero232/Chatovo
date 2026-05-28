'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import { ownerBadgeStyles as s } from './OwnerBadge.styles';
import type { OwnerBadgeProps } from './OwnerBadge.types';

export const OwnerBadge = ({ className }: OwnerBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span className={cn(s.root, className)}>
      <Crown className={s.icon} />
      {t('yours')}
    </span>
  );
};
