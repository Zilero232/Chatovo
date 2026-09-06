import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { RevealOnScroll, Text } from '@/ui-kit';
import { MarketingSection, MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_FAQ_KEYS } from '../../../config';

import s from '../../HomePage.module.scss';

export const HomeFaq = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.faq' });

  return (
    <MarketingSection id='faq'>
      <MarketingSectionHead description={t('subheading')} heading={t('heading')} />

      <div className={s.faqList}>
        {HOME_FAQ_KEYS.map((key, index) => (
          <RevealOnScroll
            key={key}
            as='article'
            className={clsx(s.faqItem, 'glass')}
            delay={Math.min(index, 4) * 0.05}
          >
            <Text as='h3' className={s.faqQuestion} weight='semibold'>
              {t(`items.${key}.question`)}
            </Text>
            <Text className={s.faqAnswer} size='sm' tone='muted'>
              {t(`items.${key}.answer`)}
            </Text>
          </RevealOnScroll>
        ))}
      </div>
    </MarketingSection>
  );
};
