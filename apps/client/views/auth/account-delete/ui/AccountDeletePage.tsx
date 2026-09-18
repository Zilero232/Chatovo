'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { LEGAL } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Text } from '@/ui-kit';
import { StandaloneShell } from '@/widgets/layout/standalone-shell';

import s from './AccountDeletePage.module.scss';

export const AccountDeletePage = () => {
  const t = useTranslations('accountDelete');

  return (
    <StandaloneShell>
      <article className={clsx(s.shell, 'glass', 'shadow-glow-violet')}>
        <h1 className={s.title}>{t('title')}</h1>

        <Text tone='muted'>{t('intro')}</Text>

        <ol className={s.steps}>
          <li>
            <Text size='sm'>{t('step1')}</Text>
          </li>
          <li>
            <Text size='sm'>{t('step2')}</Text>
          </li>
          <li>
            <Text size='sm'>{t('step3')}</Text>
          </li>
        </ol>

        <Text size='sm' tone='muted'>
          {t('removed')}
        </Text>

        <Text size='sm' tone='muted'>
          {t('kept')}
        </Text>

        <div className={s.actions}>
          <Link className={s.primaryAction} href={ROUTES.auth}>
            {t('signIn')}
          </Link>

          <a className={s.secondaryAction} href={`mailto:${LEGAL.supportEmail}`}>
            {t('contact')}
          </a>
        </div>
      </article>
    </StandaloneShell>
  );
};
