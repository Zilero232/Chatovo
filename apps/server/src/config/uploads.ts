import { AVATAR_MAX_DIMENSION, IMAGE_PROCESSABLE_MIMES } from '@chatovo/schemas';

export const UPLOADS = {
  route: '/uploads',
  inlineImageExtensions: new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']),
  sandboxCsp: "default-src 'none'; sandbox",
  cacheControl: 'public, max-age=31536000, immutable',
  temporarySuffix: '.tmp',
  image: {
    processableMimes: new Set(IMAGE_PROCESSABLE_MIMES),
    decodableFormats: new Set(['jpeg', 'png', 'webp', 'gif', 'heif']),
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
  }
} as const;
