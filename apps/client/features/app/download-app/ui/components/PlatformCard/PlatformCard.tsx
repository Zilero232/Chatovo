'use client';

import { clsx } from 'clsx';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import prettyBytes from 'pretty-bytes';

import type { PlatformCardProps } from './PlatformCard.types';

import s from './PlatformCard.module.scss';

export const PlatformCard = ({ label, Icon, asset }: PlatformCardProps) => {
  const t = useTranslations('downloadApp');

  if (!asset) {
    return (
      <div className={clsx(s.root, s.unavailable)}>
        <Icon aria-hidden className={s.icon} />
        <span className={s.name}>{label}</span>
        <span className={s.unavailableLabel}>{t('notAvailable')}</span>
      </div>
    );
  }

  return (
    <a
      download
      className={clsx(s.root, s.available)}
      href={asset.downloadUrl}
      rel='noopener noreferrer'
      target='_blank'
    >
      <span aria-hidden className={s.iconBox}>
        <Icon className={s.icon} />
      </span>

      <span className={s.name}>{label}</span>
      <span className={s.size}>{prettyBytes(asset.sizeBytes)}</span>

      <span aria-hidden className={s.action}>
        <Download className={s.actionIcon} />
      </span>
    </a>
  );
};
