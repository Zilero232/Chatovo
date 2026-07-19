import {
  LandingBackground,
  LandingDesktop,
  LandingFaq,
  LandingFeatures,
  LandingFinalCta,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingSteps,
} from './components';
import { LandingControllers } from './controllers';

import s from './LandingPage.module.scss';

import type { LandingPageProps } from './LandingPage.types';

export const LandingPage = ({ locale }: LandingPageProps) => (
  <div className={s.root}>
    <LandingControllers locale={locale} />
    <LandingBackground />

    <LandingHeader locale={locale} />

    <main>
      <LandingHero locale={locale} />
      <LandingFeatures locale={locale} />
      <LandingSteps locale={locale} />
      <LandingDesktop locale={locale} />
      <LandingFaq locale={locale} />
      <LandingFinalCta locale={locale} />
    </main>

    <LandingFooter locale={locale} />
  </div>
);
