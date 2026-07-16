import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { LandingPage } from '@/views/landing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  keywords: [...SITE.keywords],
  alternates: {
    canonical: ROUTES.landing,
    languages: {
      ru: ROUTES.landing,
      en: ROUTES.landingEn,
      'x-default': ROUTES.landing,
    },
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: ROUTES.landing,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const dynamic = 'force-static';

const Page = () => <LandingPage locale="ru" />;

export default Page;
