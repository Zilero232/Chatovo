import { isTauri } from '@tauri-apps/api/core';
import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants/routes';
import { buildDeepLinkUrl } from '@/shared/lib/deep-link';
import { isTauriMobile } from '@/shared/lib/tauri-platform';

export const getPublicAppOrigin = (): string => {
  if (typeof window !== 'undefined' && !isTauri()) {
    return window.location.origin;
  }

  return SITE.url;
};

export const buildPublicAppUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${getPublicAppOrigin().replace(/\/$/, '')}${normalizedPath}`;
};

export const buildPasswordResetRedirectUrl = (): string => {
  if (typeof window !== 'undefined' && isTauriMobile()) {
    return buildDeepLinkUrl(ROUTES.resetPassword);
  }

  return buildPublicAppUrl(ROUTES.resetPassword);
};
