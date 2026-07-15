import { isTauri } from '@tauri-apps/api/core';

import { SITE } from '@/shared/config';

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
