import type { ComponentType } from 'react';

import type { Locale } from '@/shared/i18n';
import type { MarketingNamespace } from '@/shared/seo';

import { EN_PREFIX, ROUTES } from '@/shared/constants';
import { AboutPage } from '@/views/about';
import { ChangelogPage } from '@/views/changelog';
import { DownloadPage } from '@/views/download';
import { FeaturesPage } from '@/views/features';
import { HomePage } from '@/views/home';
import { SupportPage } from '@/views/support';

export type MarketingPage = {
  view: ComponentType<{ locale: Locale }>;
  namespace: MarketingNamespace;
  path: string;
};

export const EN_SEGMENT = EN_PREFIX.slice(1);

export const HOME_SEGMENT = '';

export const MARKETING_PAGES: Record<string, MarketingPage> = {
  [HOME_SEGMENT]: { view: HomePage, namespace: 'home', path: ROUTES.home },
  features: { view: FeaturesPage, namespace: 'features', path: ROUTES.features },
  download: { view: DownloadPage, namespace: 'download', path: ROUTES.download },
  about: { view: AboutPage, namespace: 'about', path: ROUTES.about },
  support: { view: SupportPage, namespace: 'support', path: ROUTES.support },
  changelog: { view: ChangelogPage, namespace: 'changelog', path: ROUTES.changelog }
};
