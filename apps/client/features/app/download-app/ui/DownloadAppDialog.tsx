'use client';

import { Download, Loader2, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DOWNLOAD_PLATFORMS, useRelease } from '@/entities/app/release';
import { EXTERNAL_LINKS } from '@/shared/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Text
} from '@/ui-kit';

import type { DownloadAppDialogProps } from './DownloadAppDialog.types';

import { PlatformCard } from './components';

import s from './DownloadAppDialog.module.scss';

export const DownloadAppDialog = ({ open, onOpenChange }: DownloadAppDialogProps) => {
  const t = useTranslations('downloadApp');
  const { isLoading, isError, data: release } = useRelease(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader icon={<Download />} tone='cyan'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className={s.description}>{t('description')}</DialogDescription>
        </DialogHeader>

        {isLoading && <Loader2 className={s.spinner} />}

        {isError && (
          <div className={s.fallback}>
            {t('loadFailed')}{' '}
            <a
              className={s.fallbackLink}
              href={EXTERNAL_LINKS.appReleases}
              rel='noopener noreferrer'
              target='_blank'
            >
              {t('openReleases')}
            </a>
          </div>
        )}

        {release && (
          <>
            <div className={s.section}>
              <Text className={s.sectionTitle} size='xs' tone='muted' weight='medium'>
                {t('sections.desktop')}
              </Text>
              <div className={s.desktopGrid}>
                {DOWNLOAD_PLATFORMS.map(({ id, labelKey, Icon }) => (
                  <PlatformCard
                    key={id}
                    asset={release.assets[id]}
                    Icon={Icon}
                    label={t(`platforms.${labelKey}`)}
                  />
                ))}
              </div>
            </div>

            <div className={s.section}>
              <Text className={s.sectionTitle} size='xs' tone='muted' weight='medium'>
                {t('sections.mobile')}
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

            <div className={s.meta}>
              <span className={s.version}>{t('version', { version: release.version })}</span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
