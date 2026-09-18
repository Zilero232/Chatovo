'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import prettyBytes from 'pretty-bytes';

import { Button } from '@/ui-kit';

import type { PlatformCardProps } from './PlatformCard.types';

import s from './PlatformCard.module.scss';

export const PlatformCard = ({ label, Icon, asset, href, isWide = false }: PlatformCardProps) => {
  const t = useTranslations('downloadApp');

  const downloadUrl = asset?.downloadUrl ?? href;
  const isAvailable = Boolean(downloadUrl);

  return (
    <div className={clsx(s.root, { [s.wide]: isWide, [s.unavailable]: !isAvailable })}>
      <span aria-hidden className={s.iconBox}>
        <Icon className={s.icon} />
      </span>

      <span className={s.name}>{label}</span>

      {isAvailable ? (
        <Button
          download={asset ? true : undefined}
          href={downloadUrl}
          rel='noopener noreferrer'
          size='sm'
          target='_blank'
        >
          {t('download')}
        </Button>
      ) : (
        <span className={s.unavailableLabel}>{t('notAvailable')}</span>
      )}

      {asset && <span className={s.size}>{prettyBytes(asset.sizeBytes)}</span>}
    </div>
  );
};
