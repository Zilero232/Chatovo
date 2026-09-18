import { ROUTES } from '@/shared/constants';

import type { BuildServerHrefOptions } from './build-server-href.types';

/** Server and channel ride in query params: the static export has no SPA fallback. */
export const buildServerHref = (serverId: string, options?: BuildServerHrefOptions) => {
  const params = new URLSearchParams({ id: serverId });

  if (options?.channelId) {
    params.set('channel', options.channelId);
  }

  if (options?.threadId) {
    params.set('thread', options.threadId);
  }

  return `${ROUTES.server}?${params.toString()}`;
};

export const buildInviteHref = (code: string) =>
  `${ROUTES.invite}?code=${encodeURIComponent(code)}`;

export const buildDmHref = (userId: string) => `${ROUTES.dm}?user=${encodeURIComponent(userId)}`;
