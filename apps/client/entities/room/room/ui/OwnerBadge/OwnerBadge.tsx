'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/ui';
import type { OwnerBadgeProps } from './OwnerBadge.types';

export const OwnerBadge = ({ className }: OwnerBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <Badge className={className} tone="amber">
      <Crown className="size-3 fill-amber-300/30" />
      {t('yours')}
    </Badge>
  );
};
