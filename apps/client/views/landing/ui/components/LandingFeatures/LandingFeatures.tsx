import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { Text } from '@/shared/ui';
import { LANDING_FEATURE_ICONS, LANDING_FEATURE_KEYS } from '../../../config';
import { LandingReveal } from '../LandingReveal';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingFeatures = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.features' });

  return (
    <section className={clsx(s.container, s.section)} id="features">
      <LandingReveal className={s.sectionHead}>
        <Text as="h2" className={s.sectionHeading} weight="semibold">
          {t('heading')}
        </Text>
        <Text size="base" tone="muted">
          {t('subheading')}
        </Text>
      </LandingReveal>

      <div className={s.features}>
        {LANDING_FEATURE_KEYS.map((key, index) => {
          const Icon = LANDING_FEATURE_ICONS[key];

          return (
            <LandingReveal
              key={key}
              as="article"
              className={clsx(s.featureCard, 'glass')}
              delay={Math.min(index, 5) * 0.05}
            >
              <span aria-hidden className={s.featureIcon}>
                <Icon />
              </span>
              <Text as="h3" weight="semibold">
                {t(`items.${key}.title`)}
              </Text>
              <Text size="sm" tone="muted">
                {t(`items.${key}.description`)}
              </Text>
            </LandingReveal>
          );
        })}
      </div>
    </section>
  );
};
