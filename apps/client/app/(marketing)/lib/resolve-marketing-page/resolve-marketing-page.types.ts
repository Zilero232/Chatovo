import type { Locale } from '@/shared/i18n';

import type { MarketingPage } from '../../config';

export type ResolvedMarketingPage = MarketingPage & {
  locale: Locale;
};

export type MarketingParams = {
  slug?: string[];
};
