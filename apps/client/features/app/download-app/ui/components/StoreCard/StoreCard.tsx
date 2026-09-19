'use client';

import { Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EXTERNAL_LINKS } from '@/shared/constants';

import s from '../../DownloadAppDialog.module.scss';

export const StoreCard = () => {
  const t = useTranslations('downloadApp');

  return (
    <a
      className={s.storeCard}
      href={EXTERNAL_LINKS.googlePlay}
      rel='noopener noreferrer'
      target='_blank'
    >
      <span aria-hidden className={s.storeIconBox}>
        <Smartphone className={s.storeIcon} />
      </span>

      <span className={s.storeName}>{t('platforms.android')}</span>

      <span aria-hidden className={s.storeAction}>
        {t('openGooglePlay')}
      </span>
    </a>
  );
};
