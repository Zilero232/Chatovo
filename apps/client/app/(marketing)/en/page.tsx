import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { LandingPage } from '@/views/landing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: SITE.en.title,
  description: SITE.en.description,
  keywords: [...SITE.en.keywords],
  alternates: {
    canonical: ROUTES.landingEn,
    languages: {
      ru: ROUTES.landing,
      en: ROUTES.landingEn,
      'x-default': ROUTES.landing,
    },
  },
  openGraph: {
    type: 'website',
    locale: SITE.en.locale,
    url: ROUTES.landingEn,
    siteName: SITE.name,
    title: SITE.en.title,
    description: SITE.en.description,
  },
  robots: { index: true, follow: true },
};

export const dynamic = 'force-static';

const Page = () => <LandingPage locale="en" />;

export default Page;
