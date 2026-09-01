import { hoursToMilliseconds, minutesToMilliseconds, secondsToMilliseconds } from 'date-fns';

export const REPO = 'Zilero232/Chatovo';

export const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'chatovo-server'
};

export const REQUEST_TIMEOUT_MS = secondsToMilliseconds(5);

export const RELEASES_CACHE_TTL_MS = minutesToMilliseconds(10);

export const CONTRIBUTORS_PER_PAGE = 30;

export const CONTRIBUTORS_CACHE_TTL_MS = hoursToMilliseconds(6);

export const UNIFIED_TAG_RE = /^v\d+\.\d+\.\d+$/;

export const DESKTOP_TAG_PREFIXES = ['desktop-v', 'app-v'] as const;
export const MOBILE_TAG_PREFIXES = ['mobile-v', 'android-v'] as const;
