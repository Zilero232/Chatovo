import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { env } from '@/shared/config';
import { STORAGE_KEYS } from '@/shared/constants';

export const getAuthToken = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(STORAGE_KEYS.authToken) ?? '';
};

export const saveAuthToken = (token: string | null | undefined): void => {
  if (typeof window === 'undefined' || !token) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.authToken, token);
};

export const clearToken = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.authToken);
};

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  basePath: '/auth',
  session: {
    refetchOnWindowFocus: false,
  },
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: 'string', input: false },
        verified: { type: 'boolean', input: false },
      },
    }),
  ],
  fetchOptions: {
    auth: {
      type: 'Bearer',
      token: getAuthToken,
    },
    onSuccess: (ctx) => {
      const token = ctx.response.headers.get('set-auth-token');

      saveAuthToken(token);
    },
  },
});
