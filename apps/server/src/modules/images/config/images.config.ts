import { CronExpression } from '@nestjs/schedule';
import { hoursToMilliseconds, hoursToSeconds, minutesToMilliseconds } from 'date-fns';

import { UPLOADS } from '../../../config/uploads';

export const IMAGES = {
  contentType: 'image/webp',
  uploadsPathPrefix: `${UPLOADS.route}/`,
  forbiddenKeyCharacters: /[\\\0]/,
  throttle: { limit: 600, ttl: minutesToMilliseconds(1) },
  remoteMaxBytes: 15 * 1024 * 1024,
  remoteCacheTtlMs: hoursToMilliseconds(24),
  responseHeaders: {
    'Content-Security-Policy': UPLOADS.sandboxCsp,
    'Cross-Origin-Resource-Policy': 'cross-origin'
  },
  cache: {
    maxIdleMs: hoursToMilliseconds(24 * 14),
    maxBytes: 2 * 1024 ** 3,
    touchAfterMs: hoursToMilliseconds(24),
    temporaryMaxAgeMs: hoursToMilliseconds(1),
    sweepCron: CronExpression.EVERY_HOUR
  },
  cacheControl: {
    upload: UPLOADS.cacheControl,
    remote: `public, max-age=${hoursToSeconds(24)}, stale-while-revalidate=${hoursToSeconds(24 * 7)}`
  }
} as const;
