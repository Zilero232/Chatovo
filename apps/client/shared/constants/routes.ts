import { APP_SCHEME } from './scheme';

const AUTH_PATH = '/auth';

export const EN_PREFIX = '/en';

export const ROUTES = {
  home: '/',
  homeEn: EN_PREFIX,
  lobby: '/lobby',
  auth: AUTH_PATH,
  resetPassword: `${AUTH_PATH}/reset-password`,
  room: '/room',
  admin: '/admin',
  privacy: '/privacy',
  terms: '/terms',
  accountDelete: '/account/delete',
  features: '/features',
  download: '/download',
  about: '/about',
  support: '/support',
  changelog: '/changelog'
} as const;

const LOCALIZED_MARKETING_PATHS = [
  ROUTES.features,
  ROUTES.download,
  ROUTES.about,
  ROUTES.support,
  ROUTES.changelog
] as const;

const EN_MARKETING_PATHS = LOCALIZED_MARKETING_PATHS.map((path) => `${EN_PREFIX}${path}`);

const LEGAL_PATHS = [ROUTES.privacy, ROUTES.terms] as const;

export const HOME_ROUTES = [ROUTES.home, ROUTES.homeEn] as const;

export const MARKETING_ROUTES = [
  ROUTES.home,
  ROUTES.homeEn,
  ...LOCALIZED_MARKETING_PATHS,
  ...EN_MARKETING_PATHS,
  ...LEGAL_PATHS,
  ROUTES.accountDelete
] as const;

export const PUBLIC_ROUTES = [
  ROUTES.auth,
  ROUTES.resetPassword,
  ...LEGAL_PATHS,
  ...LOCALIZED_MARKETING_PATHS,
  ...EN_MARKETING_PATHS
] as const;

/**
 * Reachable with or without a session, and never redirected either way.
 * Google Play requires the account deletion page to open for a signed-out
 * visitor, while the people who actually use it are signed in.
 */
export const OPEN_ROUTES = [ROUTES.accountDelete] as const;

export const DEEP_LINKS = {
  auth: `${APP_SCHEME}://auth`
} as const;
