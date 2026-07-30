import type { MetadataRoute } from 'next';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

export const dynamic = 'force-static';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: [ROUTES.landing, ROUTES.landingEn, ROUTES.privacy, ROUTES.terms],
    disallow: [ROUTES.lobby, ROUTES.room, ROUTES.auth]
  },
  sitemap: `${SITE.url}/sitemap.xml`,
  host: SITE.url
});

export default robots;
