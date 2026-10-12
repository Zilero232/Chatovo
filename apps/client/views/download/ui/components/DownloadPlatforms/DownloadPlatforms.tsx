'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useRelease } from '@/entities/app/release';
import { PlatformGrid } from '@/features/app/download-app';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { Text } from '@/ui-kit';

import s from '../../DownloadPage.module.scss';

export const DownloadPlatforms = () => {
  const t = useTranslations('downloadApp');

  const { isLoading, isError, data: release } = useRelease();

  return (
    <div className={s.platforms}>
      {isLoading && <Loader2 aria-label={t('title')} className={s.spinner} />}

      {isError && (
        <Text size='sm' tone='muted'>
          {t('loadFailed')}{' '}
          <a
            className={s.inlineLink}
            href={EXTERNAL_LINKS.appReleases}
            rel='noopener noreferrer'
            target='_blank'
          >
            {t('openReleases')}
          </a>
        </Text>
      )}

      {release && (
        <Text size='sm' tone='muted'>
          {t('version', { version: release.version })}
        </Text>
      )}

      {!isLoading && <PlatformGrid release={release} />}
    </div>
  );
};
