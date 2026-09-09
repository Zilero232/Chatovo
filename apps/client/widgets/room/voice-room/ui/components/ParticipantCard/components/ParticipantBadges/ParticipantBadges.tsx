'use client';

import { clsx } from 'clsx';
import { EyeOff, ScreenShare } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ParticipantBadgesProps } from './ParticipantBadges.types';

import s from '../../ParticipantCard.module.scss';

export const ParticipantBadges = ({ hasScreen, invisible }: ParticipantBadgesProps) => {
  const t = useTranslations('room');

  if (!hasScreen && !invisible) {
    return null;
  }

  return (
    <div className={s.badges}>
      {invisible && (
        <span className={clsx(s.badge, s.badgeInvisible)}>
          <EyeOff className={s.badgeIcon} />
          {t('invisibleBadge')}
        </span>
      )}
      {hasScreen && (
        <span className={s.badge}>
          <ScreenShare className={s.badgeIcon} />
          share
        </span>
      )}
    </div>
  );
};
