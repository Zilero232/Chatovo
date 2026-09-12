import { LEGAL } from '@/shared/config';

export const EXTERNAL_LINKS = {
  appReleases: 'https://github.com/Zilero232/Chatovo/releases',
  repository: 'https://github.com/Zilero232/Chatovo',
  issues: 'https://github.com/Zilero232/Chatovo/issues',
  gnomeVpn: 'https://gnomevpn.ru',
  privacy: LEGAL.privacyUrl,
  terms: LEGAL.termsUrl,
  googlePlay: LEGAL.googlePlayUrl,
  supportEmail: `mailto:${LEGAL.supportEmail}`
} as const;
