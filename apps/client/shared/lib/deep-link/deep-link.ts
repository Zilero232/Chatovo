import { APP_SCHEME } from '@/shared/constants/scheme';

export const buildDeepLinkUrl = (
  path: string,
  searchParams?: Record<string, string | undefined>,
): string => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const [host, ...rest] = normalizedPath.split('/');
  const pathname = rest.length > 0 ? `/${rest.join('/')}` : '';
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) {
        params.set(key, value);
      }
    }
  }

  const query = params.size > 0 ? `?${params.toString()}` : '';

  return `${APP_SCHEME}://${host}${pathname}${query}`;
};

export const parseDeepLinkToAppPath = (url: string): string | null => {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== `${APP_SCHEME}:`) {
      return null;
    }

    const path = `/${parsed.host}${parsed.pathname === '/' ? '' : parsed.pathname}`;

    return `${path}${parsed.search}`;
  } catch {
    return null;
  }
};
