'use client';

import { MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/cn';
import { micMutedBadgeStyles as s } from './MicMutedBadge.styles';
import type { MicMutedBadgeProps } from './MicMutedBadge.types';

export const MicMutedBadge = ({ className }: MicMutedBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <span
      aria-label={t('micMuted')}
      className={cn(s.root, className)}
      role="img"
      title={t('micMuted')}
    >
      <MicOff className={s.icon} />
    </span>
  );
};
