'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import { ownerCrownStyles as s } from './OwnerCrown.styles';
import type { OwnerCrownProps } from './OwnerCrown.types';

export const OwnerCrown = ({ className }: OwnerCrownProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('ownerTooltip')}
      className={cn(s.root, className)}
      role="img"
      title={t('ownerTooltip')}
    >
      <Crown className={s.icon} />
    </span>
  );
};
