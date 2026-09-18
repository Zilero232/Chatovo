'use client';

import { Download, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DOWNLOAD_PLATFORMS, useRelease } from '@/entities/app/release';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Skeleton, Text } from '@/ui-kit';

import type { DownloadAppDialogProps } from './DownloadAppDialog.types';

import { PlatformCard } from './components';

import s from './DownloadAppDialog.module.scss';

const SKELETON_KEYS = ['a', 'b', 'c'] as const;

export const DownloadAppDialog = ({ open, onOpenChange }: DownloadAppDialogProps) => {
  const t = useTranslations('downloadApp');
  const { isLoading, isError, data: release } = useRelease(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader icon={<Download />} tone='cyan'>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <section className={s.section}>
          <Text className={s.sectionTitle} size='sm' tone='muted'>
            {t('sections.desktop')}
          </Text>

          {isLoading ? (
            <div className={s.desktopGrid}>
              {SKELETON_KEYS.map((key) => (
                <Skeleton key={key} className={s.cardSkeleton} />
              ))}
            </div>
          ) : (
            <div className={s.desktopGrid}>
              {DOWNLOAD_PLATFORMS.map(({ id, labelKey, Icon }) => (
                <PlatformCard
                  key={id}
                  asset={release?.assets[id]}
                  Icon={Icon}
                  label={t(`platforms.${labelKey}`)}
                />
              ))}
            </div>
          )}
        </section>

        <section className={s.section}>
          <Text className={s.sectionTitle} size='sm' tone='muted'>
            {t('sections.mobile')}
          </Text>

          <div className={s.mobileGrid}>
            <PlatformCard
              isWide
              href={EXTERNAL_LINKS.googlePlay}
              Icon={Smartphone}
              label={t('platforms.android')}
            />
          </div>
        </section>

        <footer className={s.footer}>
          {isError ? t('loadFailed') : t('allReleasesHint')}{' '}
          <a
            className={s.footerLink}
            href={EXTERNAL_LINKS.appReleases}
            rel='noopener noreferrer'
            target='_blank'
          >
            {t('openReleases')}
          </a>
          {release && (
            <span className={s.version}>{t('version', { version: release.version })}</span>
          )}
        </footer>
      </DialogContent>
    </Dialog>
  );
};
