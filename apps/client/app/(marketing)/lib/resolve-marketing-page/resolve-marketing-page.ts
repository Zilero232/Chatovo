import type { ResolvedMarketingPage } from './resolve-marketing-page.types';

import { EN_SEGMENT, HOME_SEGMENT, MARKETING_PAGES } from '../../config';

export const marketingStaticParams = (): { slug: string[] }[] =>
  Object.keys(MARKETING_PAGES).flatMap((segment) => {
    const ruSlug = segment === HOME_SEGMENT ? [] : [segment];
    const enSlug = segment === HOME_SEGMENT ? [EN_SEGMENT] : [EN_SEGMENT, segment];

    return [{ slug: ruSlug }, { slug: enSlug }];
  });

export const resolveMarketingPage = (slug: string[] = []): ResolvedMarketingPage | null => {
  const isEnglish = slug[0] === EN_SEGMENT;

  const segments = isEnglish ? slug.slice(1) : slug;

  if (segments.length > 1) {
    return null;
  }

  const page = MARKETING_PAGES[segments[0] ?? HOME_SEGMENT];

  if (!page) {
    return null;
  }

  return { ...page, locale: isEnglish ? 'en' : 'ru' };
};
