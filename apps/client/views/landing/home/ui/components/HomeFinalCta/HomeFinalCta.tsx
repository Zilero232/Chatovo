import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';

import { RevealOnScroll, Text } from '@/ui-kit';
import { MarketingAuthCta, MarketingSection } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import s from '../../HomePage.module.scss';

export const HomeFinalCta = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.finalCta' });

  return (
    <MarketingSection>
      <RevealOnScroll className={clsx(s.finalCta, 'glass')}>
        <div aria-hidden className={s.finalCtaGlow} />

        <Text as='h2' className={s.finalCtaHeading} weight='bold'>
          {t('heading')}
        </Text>

        <Text className={s.finalCtaDescription} size='base' tone='muted'>
          {t('description')}
        </Text>

        <div className={s.finalCtaActions}>
          <MarketingAuthCta openAppLabel={t('actionOpenApp')} signInLabel={t('action')} size='lg' />

          <Text size='sm' tone='muted'>
            {t('note')}
          </Text>
        </div>
      </RevealOnScroll>
    </MarketingSection>
  );
};
