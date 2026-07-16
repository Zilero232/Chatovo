'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LEGAL } from '@/shared/config';
import { Text } from '@/shared/ui';

import s from './AuthLegalFooter.module.scss';

export const AuthLegalFooter = () => {
  const t = useTranslations('legal');

  return (
    <Text align="center" className={s.root} size="xs" tone="inherit">
      <Link className={s.link} href={LEGAL.privacyPath}>
        {t('privacy')}
      </Link>
      <span className={s.sep}>·</span>
      <Link className={s.link} href={LEGAL.termsPath}>
        {t('terms')}
      </Link>
    </Text>
  );
};
