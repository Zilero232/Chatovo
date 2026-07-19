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
    alternateLocale: [SITE.locale],
    url: ROUTES.landingEn,
    siteName: SITE.name,
    title: SITE.en.title,
    description: SITE.en.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.en.title,
    description: SITE.en.description,
  },
  robots: { index: true, follow: true },
};

const Page = () => <LandingPage locale="en" />;

export default Page;
