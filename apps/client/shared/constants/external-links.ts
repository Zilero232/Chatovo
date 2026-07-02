import { LEGAL } from '@/shared/config';

export const EXTERNAL_LINKS = {
  appReleases: 'https://github.com/Zilero232/Chatovo/releases',
  repository: 'https://github.com/Zilero232/Chatovo',
  privacy: LEGAL.privacyUrl,
  terms: LEGAL.termsUrl,
  playStore: LEGAL.playStoreUrl,
  supportEmail: `mailto:${LEGAL.supportEmail}`,
} as const;
