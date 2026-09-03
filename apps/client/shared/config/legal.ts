import { SITE } from './site';

export const LEGAL = {
  supportEmail: 'zilero@chatovo.ru',
  privacyPath: '/privacy',
  termsPath: '/terms',
  privacyUrl: `${SITE.url}/privacy`,
  termsUrl: `${SITE.url}/terms`,
  rustoreUrl: 'https://www.rustore.ru/catalog/app/chatovo.app'
} as const;
