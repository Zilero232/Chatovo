import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

import type { Locale } from '@/shared/i18n';

export type LandingLocale = Locale;

export const LANDING_HTML_LANG: Record<LandingLocale, string> = {
  ru: SITE.lang,
  en: SITE.en.lang,
};

export const LANDING_LOCALE_SWITCH: Record<LandingLocale, { href: string; hrefLang: string }> = {
  ru: { href: ROUTES.landingEn, hrefLang: SITE.en.lang },
  en: { href: ROUTES.landing, hrefLang: SITE.lang },
};
