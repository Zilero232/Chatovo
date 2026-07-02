'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LEGAL } from '@/shared/config';
import { authLegalFooterStyles as s } from './AuthLegalFooter.styles';

export const AuthLegalFooter = () => {
  const t = useTranslations('legal');

  return (
    <p className={s.root}>
      <Link className={s.link} href={LEGAL.privacyPath}>
        {t('privacy')}
      </Link>
      <span className={s.sep}>·</span>
      <Link className={s.link} href={LEGAL.termsPath}>
        {t('terms')}
      </Link>
    </p>
  );
};
