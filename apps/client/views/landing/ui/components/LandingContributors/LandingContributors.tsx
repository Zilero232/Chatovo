import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { Text } from '@/ui-kit';

import type { LandingSectionProps } from '../../LandingPage.types';

import { LandingReveal } from '../LandingReveal/LandingReveal';
import { ContributorsList } from './components';

import s from '../../LandingPage.module.scss';

export const LandingContributors = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.contributors' });

  return (
    <section className={clsx(s.container, s.section)} id='contributors'>
      <LandingReveal className={s.sectionHead}>
        <Text as='h2' className={s.sectionHeading} weight='semibold'>
          {t('heading')}
        </Text>
        <Text size='base' tone='muted'>
          {t('subheading')}
        </Text>
      </LandingReveal>

      <LandingReveal delay={0.08}>
        <ContributorsList />
      </LandingReveal>
    </section>
  );
};
