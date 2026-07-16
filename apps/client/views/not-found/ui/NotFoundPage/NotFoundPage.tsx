'use client';

import { clsx } from 'clsx';
import { ArrowLeft, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Button, Text } from '@/shared/ui';

import s from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  const router = useRouter();

  const t = useTranslations('notFound');

  return (
    <main className={s.root}>
      <span aria-hidden className={s.orb} data-tone="violet" />
      <span aria-hidden className={s.orb} data-tone="cyan" />

      <div className={clsx(s.badge, 'glass')}>
        <Compass aria-hidden className={s.logo} />
      </div>

      <p className={clsx(s.code, 'gradient-text')}>404</p>

      <h1 className={s.title}>{t('title')}</h1>
      <Text className={s.description} tone="muted">
        {t('description')}
      </Text>

      <div className={s.actions}>
        <Button onClick={() => router.push(ROUTES.lobby)}>
          <Compass />
          {t('toLobby')}
        </Button>

        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft />
          {t('back')}
        </Button>
      </div>
    </main>
  );
};
