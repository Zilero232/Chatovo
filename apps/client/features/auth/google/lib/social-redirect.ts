import { isTauri } from '@tauri-apps/api/core';
import { env } from '@/shared/config';
import { buildAbsoluteUrl, DEEP_LINKS, ROUTES } from '@/shared/constants';

const finalTarget = (): string => {
  if (isTauri()) {
    return DEEP_LINKS.auth;
  }

  return buildAbsoluteUrl(ROUTES.auth);
};

export const socialCallbackURL = (): string => {
  const apiBase = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  const redirect = encodeURIComponent(finalTarget());

  return `${apiBase}/auth/social-done?redirect=${redirect}`;
};
