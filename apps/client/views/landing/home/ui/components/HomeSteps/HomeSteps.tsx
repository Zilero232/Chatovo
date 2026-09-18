import { getTranslations } from 'next-intl/server';

import { RevealOnScroll, Text } from '@/ui-kit';
import { MarketingSection, MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_STEP_KEYS } from '../../../config';
import { HomeFlowDiagram } from '../HomeFlowDiagram/HomeFlowDiagram';

import s from '../../HomePage.module.scss';

export const HomeSteps = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.steps' });

  return (
    <MarketingSection id='how-it-works'>
      <MarketingSectionHead description={t('subheading')} heading={t('heading')} />

      <ol className={s.steps}>
        {HOME_STEP_KEYS.map((key, index) => (
          <RevealOnScroll key={key} as='li' className={s.step} delay={index * 0.08}>
            <Text as='span' className={s.stepIndex} size='xs' tone='inherit' weight='semibold'>
              {String(index + 1).padStart(2, '0')}
            </Text>
            <Text as='h3' className={s.stepTitle} weight='semibold'>
              {t(`items.${key}.title`)}
            </Text>
            <Text size='sm' tone='muted'>
              {t(`items.${key}.description`)}
            </Text>
          </RevealOnScroll>
        ))}
      </ol>

      <RevealOnScroll delay={0.24}>
        <HomeFlowDiagram locale={locale} />
      </RevealOnScroll>
    </MarketingSection>
  );
};
