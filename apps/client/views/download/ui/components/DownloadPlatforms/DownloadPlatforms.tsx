'use client';

import { Loader2, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DOWNLOAD_PLATFORMS, useRelease } from '@/entities/app/release';
import { PlatformCard } from '@/features/app/download-app';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { Text } from '@/ui-kit';

import s from '../../DownloadPage.module.scss';

export const DownloadPlatforms = () => {
  const t = useTranslations('downloadApp');
  const tPage = useTranslations('download');

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
        <>
          <Text size='sm' tone='muted'>
            {t('version', { version: release.version })}
          </Text>

          <div className={s.platformGrid}>
            {DOWNLOAD_PLATFORMS.map(({ id, labelKey, Icon }) => (
              <PlatformCard
                key={id}
                asset={release.assets[id]}
                Icon={Icon}
                label={t(`platforms.${labelKey}`)}
              />
            ))}
          </div>
        </>
      )}

      <div className={s.mobile}>
        <Text as='h3' className={s.subheading} weight='semibold'>
          {tPage('mobile.heading')}
        </Text>
        <Text size='sm' tone='muted'>
          {tPage('mobile.description')}
        </Text>

        <a
          className={s.storeLink}
          href={EXTERNAL_LINKS.rustore}
          rel='noopener noreferrer'
          target='_blank'
        >
          <Smartphone />
          {t('openRustore')}
        </a>
      </div>
    </div>
  );
};
