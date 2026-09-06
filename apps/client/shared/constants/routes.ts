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

export const HOME_ROUTES = [ROUTES.home, ROUTES.homeEn] as const;

export const MARKETING_ROUTES = [
  ROUTES.home,
  ROUTES.homeEn,
  ...LOCALIZED_MARKETING_PATHS,
  ...EN_MARKETING_PATHS,
  ROUTES.privacy,
  ROUTES.terms
] as const;

export const PUBLIC_ROUTES = [
  ROUTES.auth,
  ROUTES.resetPassword,
  ROUTES.privacy,
  ROUTES.terms,
  ...LOCALIZED_MARKETING_PATHS,
  ...EN_MARKETING_PATHS
] as const;

export const DEEP_LINKS = {
  auth: `${APP_SCHEME}://auth`
} as const;
