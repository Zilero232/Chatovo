'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { formatBytes } from '@/shared/lib/format-bytes';

import s from './PlatformCard.module.scss';

import type { PlatformCardProps } from './PlatformCard.types';

export const PlatformCard = ({ label, Icon, asset }: PlatformCardProps) => {
  const t = useTranslations('downloadApp');

  if (!asset) {
    return (
      <div className={clsx(s.root, s.unavailable)}>
        <Icon className={s.icon} />
        <span className={s.name}>{label}</span>
        <span className={s.unavailableLabel}>{t('notAvailable')}</span>
      </div>
    );
  }

  return (
    <a
      className={clsx(s.root, s.available)}
      download
      href={asset.downloadUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon className={s.icon} />
      <span className={s.name}>{label}</span>
      <span className={s.size}>{formatBytes(asset.sizeBytes)}</span>
    </a>
  );
};
