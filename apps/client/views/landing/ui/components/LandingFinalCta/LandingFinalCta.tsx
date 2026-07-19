import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import { Button, Text } from '@/shared/ui';
import { LandingReveal } from '../LandingReveal';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingFinalCta = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.finalCta' });

  return (
    <section className={clsx(s.container, s.section)}>
      <LandingReveal className={clsx(s.finalCta, 'glass')}>
        <div aria-hidden className={s.finalCtaGlow} />

        <Text as="h2" className={s.finalCtaHeading} weight="bold">
          {t('heading')}
        </Text>

        <Text className={s.finalCtaDescription} size="base" tone="muted">
          {t('description')}
        </Text>

        <div className={s.finalCtaActions}>
          <Button href={ROUTES.auth} size="lg">
            {t('action')}
          </Button>

          <Text size="sm" tone="muted">
            {t('note')}
          </Text>
        </div>
      </LandingReveal>
    </section>
  );
};
