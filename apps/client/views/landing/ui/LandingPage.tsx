import { FaqJsonLdScript } from '@/shared/seo';
import { LANDING_CONTENT } from '../config';
import {
  LandingBackground,
  LandingFaq,
  LandingFeatures,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingSteps,
} from './components';
import { LandingControllers } from './controllers';

import s from './LandingPage.module.scss';

import type { LandingPageProps } from './LandingPage.types';

export const LandingPage = ({ locale }: LandingPageProps) => {
  const content = LANDING_CONTENT[locale];

  return (
    <div className={s.root}>
      <FaqJsonLdScript items={content.faq.items} />
      <LandingControllers locale={locale} />
      <LandingBackground />

      <LandingHeader content={content} locale={locale} />

      <main>
        <LandingHero content={content} locale={locale} />
        <LandingFeatures content={content} />
        <LandingSteps content={content} />
        <LandingFaq content={content} />
      </main>

      <LandingFooter content={content} />
    </div>
  );
};
