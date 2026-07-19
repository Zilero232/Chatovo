import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { Text } from '@/shared/ui';
import { LANDING_STEP_KEYS } from '../../../config';
import { LandingReveal } from '../LandingReveal';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingSteps = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.steps' });

  return (
    <section className={clsx(s.container, s.section)} id="how-it-works">
      <LandingReveal className={s.sectionHead}>
        <Text as="h2" className={s.sectionHeading} weight="semibold">
          {t('heading')}
        </Text>
        <Text size="base" tone="muted">
          {t('subheading')}
        </Text>
      </LandingReveal>

      <ol className={s.steps}>
        {LANDING_STEP_KEYS.map((key, index) => (
          <LandingReveal key={key} as="li" className={s.step} delay={index * 0.08}>
            <Text as="span" className={s.stepIndex} size="xs" tone="inherit" weight="semibold">
              {String(index + 1).padStart(2, '0')}
            </Text>
            <Text as="h3" className={s.stepTitle} weight="semibold">
              {t(`items.${key}.title`)}
            </Text>
            <Text size="sm" tone="muted">
              {t(`items.${key}.description`)}
            </Text>
          </LandingReveal>
        ))}
      </ol>
    </section>
  );
};
