import { CronExpression } from '@nestjs/schedule';
import { hoursToMilliseconds, hoursToSeconds, minutesToMilliseconds } from 'date-fns';

import { UPLOAD_CACHE_CONTROL, UPLOAD_SANDBOX_CSP, UPLOADS_ROUTE } from '../../../config/uploads';

export const IMAGES = {
  contentType: 'image/webp',
  uploadsPathPrefix: `${UPLOADS_ROUTE}/`,
  forbiddenKeyCharacters: /[\\\0]/,
  throttle: { limit: 600, ttl: minutesToMilliseconds(1) },
  remoteMaxBytes: 15 * 1024 * 1024,
  remoteCacheTtlMs: hoursToMilliseconds(24),
  responseHeaders: {
    'Content-Security-Policy': UPLOAD_SANDBOX_CSP,
    'Cross-Origin-Resource-Policy': 'cross-origin'
  },
  cache: {
    maxIdleMs: hoursToMilliseconds(24 * 14),
    maxBytes: 2 * 1024 ** 3,
    touchAfterMs: hoursToMilliseconds(24),
    temporarySuffix: '.tmp',
    temporaryMaxAgeMs: hoursToMilliseconds(1),
    sweepCron: CronExpression.EVERY_HOUR
  },
  cacheControl: {
    upload: UPLOAD_CACHE_CONTROL,
    remote: `public, max-age=${hoursToSeconds(24)}, stale-while-revalidate=${hoursToSeconds(24 * 7)}`
  }
} as const;
