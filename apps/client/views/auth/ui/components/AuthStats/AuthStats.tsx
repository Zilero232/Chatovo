'use client';

import { useTranslations } from 'next-intl';

import { Text } from '@/shared/ui';
import { AUTH_STAT_KEYS } from '../../../config';

import s from './AuthStats.module.scss';

export const AuthStats = () => {
  const t = useTranslations('auth.stats');

  return (
    <dl className={s.root}>
      {AUTH_STAT_KEYS.map((key) => (
        <div key={key} className={s.stat}>
          <Text as="dt" className={s.value} weight="bold">
            {t(`${key}.value`)}
          </Text>
          <Text as="dd" className={s.label} size="xs" tone="muted">
            {t(`${key}.label`)}
          </Text>
        </div>
      ))}
    </dl>
  );
};
