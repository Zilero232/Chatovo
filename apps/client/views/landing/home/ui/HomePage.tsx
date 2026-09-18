import { ROUTES } from '@/shared/constants';
import { ContributorsSection } from '@/widgets/marketing/contributors-list';
import { MarketingShell } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from './HomePage.types';

import {
  HomeDesktop,
  HomeFaq,
  HomeFeatures,
  HomeFinalCta,
  HomeHero,
  HomeSteps
} from './components';
import { HomeLocaleRedirect } from './controllers';

export const HomePage = ({ locale }: HomePageProps) => (
  <MarketingShell locale={locale} path={ROUTES.home}>
    <HomeLocaleRedirect locale={locale} />

    <HomeHero locale={locale} />
    <HomeFeatures locale={locale} />
    <HomeSteps locale={locale} />
    <HomeDesktop locale={locale} />
    <HomeFaq locale={locale} />
    <ContributorsSection locale={locale} namespace='home.contributors' />
    <HomeFinalCta locale={locale} />
  </MarketingShell>
);
