import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { Text } from '@/shared/ui';
import { LANDING_FAQ_COUNT } from '../../../config';
import { LandingReveal } from '../LandingReveal';
import { LandingFaqJsonLd } from './components';

import s from '../../LandingPage.module.scss';

import type { LandingSectionProps } from '../../LandingPage.types';

export const LandingFaq = async ({ locale }: LandingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'landing.faq' });

  const items = Array.from({ length: LANDING_FAQ_COUNT }, (_, index) => ({
    question: t(`items.${index}.question`),
    answer: t(`items.${index}.answer`),
  }));

  return (
    <section className={clsx(s.container, s.section)} id="faq">
      <LandingFaqJsonLd items={items} />

      <LandingReveal className={s.sectionHead}>
        <Text as="h2" className={s.sectionHeading} weight="semibold">
          {t('heading')}
        </Text>
        <Text size="base" tone="muted">
          {t('subheading')}
        </Text>
      </LandingReveal>

      <div className={s.faqList}>
        {items.map(({ question, answer }, index) => (
          <LandingReveal
            key={question}
            as="article"
            className={clsx(s.faqItem, 'glass')}
            delay={Math.min(index, 4) * 0.05}
          >
            <Text as="h3" className={s.faqQuestion} weight="semibold">
              {question}
            </Text>
            <Text className={s.faqAnswer} size="sm" tone="muted">
              {answer}
            </Text>
          </LandingReveal>
        ))}
      </div>
    </section>
  );
};
