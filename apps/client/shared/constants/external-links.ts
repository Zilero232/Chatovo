import { LEGAL } from '@/shared/config';

export const EXTERNAL_LINKS = {
  appReleases: 'https://github.com/Zilero232/Chatovo/releases',
  repository: 'https://github.com/Zilero232/Chatovo',
  gnomeVpn: 'https://gnomevpn.ru',
  privacy: LEGAL.privacyUrl,
  terms: LEGAL.termsUrl,
  rustore: LEGAL.rustoreUrl,
  supportEmail: `mailto:${LEGAL.supportEmail}`
} as const;
