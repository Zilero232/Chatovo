import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const url = (path: string) => new URL(path, SITE.url).toString();

const landingAlternates = {
  languages: {
    ru: url(ROUTES.landing),
    en: url(ROUTES.landingEn),
    'x-default': url(ROUTES.landing),
  },
};

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: url(ROUTES.landing),
    changeFrequency: 'weekly',
    priority: 1,
    alternates: landingAlternates,
  },
  {
    url: url(ROUTES.landingEn),
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: landingAlternates,
  },
  {
    url: url(ROUTES.privacy),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: url(ROUTES.terms),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

export default sitemap;
