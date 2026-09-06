import type { MetadataRoute } from 'next';

import { SITE } from '@/shared/config';
import { MARKETING_ROUTES, ROUTES } from '@/shared/constants';

export const dynamic = 'force-static';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: [...MARKETING_ROUTES],
    disallow: [ROUTES.lobby, ROUTES.room, ROUTES.auth, ROUTES.admin]
  },
  sitemap: `${SITE.url}/sitemap.xml`,
  host: SITE.url
});

export default robots;
