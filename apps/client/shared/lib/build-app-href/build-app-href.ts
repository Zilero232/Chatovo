import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

const APP_ROOT_PATHS: readonly string[] = [ROUTES.lobby];

/**
 * Link into the app host. Falls back to a same-origin path when no app host is
 * configured, so local development and the desktop shell keep working. The
 * lobby is the app host's front page, so it collapses to the bare origin.
 */
export const buildAppHref = (path: string): string => {
  const appUrl = env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    return path;
  }

  return APP_ROOT_PATHS.includes(path) ? appUrl : `${appUrl}${path}`;
};
