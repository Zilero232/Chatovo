import { HOME_ROUTES, OPEN_ROUTES, PUBLIC_ROUTES } from '@/shared/constants';

const homeRoutes: readonly string[] = HOME_ROUTES;

const matches = (routes: readonly string[], pathname: string) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

/** True for routes reachable without a session, including nested paths under one. */
export const isPublicRoute = (pathname: string): boolean => {
  if (homeRoutes.includes(pathname)) {
    return true;
  }

  return matches(PUBLIC_ROUTES, pathname);
};

/** True for routes that open for everyone and are never redirected away from. */
export const isOpenRoute = (pathname: string): boolean => matches(OPEN_ROUTES, pathname);
