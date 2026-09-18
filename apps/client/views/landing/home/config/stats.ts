type HomeHeroStatKey = 'install' | 'limit' | 'setup';

export const HOME_HERO_STAT_KEYS = ['setup', 'install', 'limit'] as const;

export const HOME_HERO_STAT_COUNTS: Record<HomeHeroStatKey, number | null> = {
  setup: 15,
  install: 0,
  limit: null
};
