import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { Text } from '@/ui-kit';

import type { LandingSectionProps } from '../../LandingPage.types';

import { LandingAuthCta } from '../LandingAuthCta/LandingAuthCta';
import { LandingReveal } from '../LandingReveal/LandingReveal';

import s from '../../LandingPage.module.scss';

export const LandingFinalCta = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.finalCta' });

  return (
    <section className={clsx(s.container, s.section)}>
      <LandingReveal className={clsx(s.finalCta, 'glass')}>
        <div aria-hidden className={s.finalCtaGlow} />

        <Text as='h2' className={s.finalCtaHeading} weight='bold'>
          {t('heading')}
        </Text>

        <Text className={s.finalCtaDescription} size='base' tone='muted'>
          {t('description')}
        </Text>

        <div className={s.finalCtaActions}>
          <LandingAuthCta openAppLabel={t('actionOpenApp')} signInLabel={t('action')} size='lg' />

          <Text size='sm' tone='muted'>
            {t('note')}
          </Text>
        </div>
      </LandingReveal>
    </section>
  );
};
