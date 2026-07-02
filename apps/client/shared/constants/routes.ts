import { APP_SCHEME } from './scheme';

const AUTH_PATH = '/auth';

export const ROUTES = {
  lobby: '/',
  auth: AUTH_PATH,
  resetPassword: `${AUTH_PATH}/reset-password`,
  room: '/room',
  privacy: '/privacy',
  terms: '/terms',
} as const;

const PUBLIC_ROUTES = [ROUTES.auth, ROUTES.resetPassword, ROUTES.privacy, ROUTES.terms] as const;

export const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export const DEEP_LINKS = {
  auth: `${APP_SCHEME}://auth`,
} as const;

export const buildRoomHref = (roomId: string) => {
  return `${ROUTES.room}?id=${encodeURIComponent(roomId)}`;
};
