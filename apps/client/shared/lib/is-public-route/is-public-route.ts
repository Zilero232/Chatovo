import { HOME_ROUTES, PUBLIC_ROUTES } from '@/shared/constants';

const homeRoutes: readonly string[] = HOME_ROUTES;

/** True for routes reachable without a session, including nested paths under one. */
export const isPublicRoute = (pathname: string): boolean => {
  if (homeRoutes.includes(pathname)) {
    return true;
  }

  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
};
