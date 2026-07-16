import type { LandingContent, LandingLocale } from '../config';

export type LandingPageProps = {
  locale: LandingLocale;
};

export type LandingContentProps = {
  content: LandingContent;
};

export type LandingSectionProps = LandingContentProps & LandingPageProps;
