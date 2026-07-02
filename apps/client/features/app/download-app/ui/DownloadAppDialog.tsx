'use client';

import { ExternalLink, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  DESKTOP_DOWNLOAD_PLATFORMS,
  MOBILE_DOWNLOAD_PLATFORMS,
  useRelease,
} from '@/entities/app/release';
import { EXTERNAL_LINKS } from '@/shared/constants';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui';
import { PlatformCard } from './components';
import { downloadAppDialogStyles as s } from './DownloadAppDialog.styles';
import type { DownloadAppDialogProps } from './DownloadAppDialog.types';

export const DownloadAppDialog = ({ open, onOpenChange }: DownloadAppDialogProps) => {
  const t = useTranslations('downloadApp');
  const { isLoading, isError, data: release } = useRelease(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader>
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
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('openReleases')}
            </a>
          </div>
        )}

        {release && (
          <>
            <div className={s.section}>
              <p className={s.sectionTitle}>{t('sections.desktop')}</p>
              <div className={s.desktopGrid}>
                {DESKTOP_DOWNLOAD_PLATFORMS.map(({ id, labelKey, Icon }) => (
                  <PlatformCard
                    key={id}
                    label={t(`platforms.${labelKey}`)}
                    Icon={Icon}
                    asset={release.assets[id]}
                  />
                ))}
              </div>
            </div>

            <div className={s.section}>
              <p className={s.sectionTitle}>{t('sections.mobile')}</p>
              <div className={s.mobileGrid}>
                {MOBILE_DOWNLOAD_PLATFORMS.map(({ id, labelKey, Icon }) => (
                  <PlatformCard
                    key={id}
                    label={t(`platforms.${labelKey}`)}
                    Icon={Icon}
                    asset={release.assets[id]}
                  />
                ))}
              </div>
            </div>

            <div className={s.meta}>
              <span>{t('version', { version: release.version })}</span>
              <a
                className={s.metaLink}
                href={release.htmlUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t('releaseNotes')} <ExternalLink className={s.metaLinkIcon} />
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
