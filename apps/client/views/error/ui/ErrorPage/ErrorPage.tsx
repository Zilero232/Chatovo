'use client';

import { clsx } from 'clsx';
import { Compass, RotateCw, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Button, Text } from '@/shared/ui';

import s from './ErrorPage.module.scss';

import type { ErrorPageProps } from './ErrorPage.types';

export const ErrorPage = ({ reset }: ErrorPageProps) => {
  const router = useRouter();

  const t = useTranslations('errorPage');

  return (
    <main className={s.root}>
      <span aria-hidden className={s.orb} data-tone="violet" />
      <span aria-hidden className={s.orb} data-tone="cyan" />

      <div className={clsx(s.badge, 'glass')}>
        <TriangleAlert aria-hidden className={s.logo} />
      </div>

      <h1 className={s.title}>{t('title')}</h1>
      <Text className={s.description} tone="muted">
        {t('description')}
      </Text>

      <div className={s.actions}>
        <Button onClick={reset}>
          <RotateCw />
          {t('retry')}
        </Button>

        <Button variant="outline" onClick={() => router.push(ROUTES.lobby)}>
          <Compass />
          {t('toLobby')}
        </Button>
      </div>
    </main>
  );
};
