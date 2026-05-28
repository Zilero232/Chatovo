'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import type { OwnerCrownProps } from './OwnerCrown.types';

// Floating overlay badge anchored to the top-left of an avatar — distinct from
// the inline `OwnerBadge` chip used in card headers.
export const OwnerCrown = ({ className }: OwnerCrownProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('ownerTooltip')}
      className={cn(
        'absolute -top-1 -left-1 z-10 flex size-3.5 items-center justify-center rounded-full bg-background ring-1 ring-background',
        className,
      )}
      role="img"
      title={t('ownerTooltip')}
    >
      <Crown className="size-2.5 fill-amber-300 text-amber-300" />
    </span>
  );
};
