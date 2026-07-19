export type LandingHeroStatKey = 'setup' | 'install' | 'limit';

export const LANDING_HERO_STAT_KEYS = ['setup', 'install', 'limit'] as const;

export const LANDING_HERO_STAT_COUNTS: Record<LandingHeroStatKey, number | null> = {
  setup: 15,
  install: 0,
  limit: null,
};
