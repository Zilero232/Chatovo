import { getTranslations } from 'next-intl/server';

import { RevealOnScroll } from '@/ui-kit';
import { MarketingSection, MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { ContributorsSectionProps } from './ContributorsSection.types';

import { ContributorsList } from '../../ContributorsList';

export const ContributorsSection = async ({ locale, namespace }: ContributorsSectionProps) => {
  const t = await getTranslations({ locale, namespace });

  return (
    <MarketingSection id='contributors'>
      <MarketingSectionHead description={t('subheading')} heading={t('heading')} />

      <RevealOnScroll delay={0.08}>
        <ContributorsList />
      </RevealOnScroll>
    </MarketingSection>
  );
};
