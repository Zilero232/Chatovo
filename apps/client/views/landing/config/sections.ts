export const LANDING_NAV_KEYS = ['features', 'how-it-works', 'desktop', 'faq'] as const;

export const LANDING_FEATURE_KEYS = [
  'rooms',
  'quality',
  'privacy',
  'screen',
  'link',
  'free',
] as const;

export const LANDING_STEP_KEYS = ['create', 'share', 'talk'] as const;

export const LANDING_DESKTOP_KEYS = ['shortcuts', 'ptt', 'platforms'] as const;

export const LANDING_FAQ_COUNT = 5;

export type LandingFeatureKey = (typeof LANDING_FEATURE_KEYS)[number];

export type LandingStepKey = (typeof LANDING_STEP_KEYS)[number];

export type LandingDesktopKey = (typeof LANDING_DESKTOP_KEYS)[number];
