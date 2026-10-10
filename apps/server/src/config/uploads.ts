import { AVATAR_MAX_DIMENSION } from '@chatovo/schemas';

export const INLINE_IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

export const UPLOADS_ROUTE = '/uploads';

export const UPLOAD_SANDBOX_CSP = "default-src 'none'; sandbox";

export const UPLOAD_CACHE_CONTROL = 'public, max-age=31536000, immutable';

export const IMAGE_PROCESSING = {
  processableMimes: new Set(['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp']),
  maxInputPixels: 50_000_000,
  avatar: {
    maxDimension: AVATAR_MAX_DIMENSION,
    quality: 80
  },
  chatOriginalQuality: 90,
  placeholder: {
    dimension: 16,
    quality: 40
  }
} as const;
