'use client';

import { useTranslations } from 'next-intl';

import type { ParticipantStatsBarsProps } from './ParticipantStatsBars.types';

import { formatSessionDuration } from './lib';

import s from './ParticipantStatsBars.module.scss';

export const ParticipantStatsBars = ({ stats }: ParticipantStatsBarsProps) => {
  const t = useTranslations('participant');

  const { presenceMs, speakingMs, speakingShare } = stats;

  const rows = [
    { key: 'presence', label: t('inRoomFor'), value: formatSessionDuration(presenceMs), fill: 1 },
    {
      key: 'speaking',
      label: t('spokeFor'),
      value: formatSessionDuration(speakingMs),
      fill: speakingShare
    }
  ] as const;

  return (
    <div className={s.root}>
      {rows.map((row) => (
        <div key={row.key} className={s.row}>
          <span className={s.label}>{row.label}</span>

          <span aria-hidden className={s.track}>
            <span className={s.fill} data-kind={row.key} style={{ scale: `${row.fill} 1` }} />
          </span>

          <span className={s.value}>{row.value}</span>
        </div>
      ))}
    </div>
  );
};
