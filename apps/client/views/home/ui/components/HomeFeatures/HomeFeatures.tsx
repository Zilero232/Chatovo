import { getTranslations } from 'next-intl/server';

import { MarketingIconGrid } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_FEATURE_ICONS, HOME_FEATURE_KEYS } from '../../../config';

export const HomeFeatures = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.features' });

  const items = HOME_FEATURE_KEYS.map((key) => ({
    key,
    Icon: HOME_FEATURE_ICONS[key],
    title: t(`items.${key}.title`),
    description: t(`items.${key}.description`)
  }));

  return (
    <MarketingIconGrid
      description={t('subheading')}
      heading={t('heading')}
      id='features'
      items={items}
    />
  );
};
