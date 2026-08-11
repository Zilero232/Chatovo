export const REPO = 'Zilero232/Chatovo';

export const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'chatovo-server'
};

export const REQUEST_TIMEOUT_MS = 5000;

export const UNIFIED_TAG_RE = /^v\d+\.\d+\.\d+$/;

export const DESKTOP_TAG_PREFIXES = ['desktop-v', 'app-v'] as const;
export const MOBILE_TAG_PREFIXES = ['mobile-v', 'android-v'] as const;
