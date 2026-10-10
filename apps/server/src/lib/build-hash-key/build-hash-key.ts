import { createHash } from 'node:crypto';

/** Stable sha256 hex key for a tuple of parts (text, numbers or raw bytes); safe as a file name or a cache key. */
export const buildHashKey = (parts: Array<number | string | Buffer>): string => {
  const hash = createHash('sha256');

  parts.forEach((part, index) => {
    if (index > 0) {
      hash.update('\n');
    }

    hash.update(typeof part === 'number' ? String(part) : part);
  });

  return hash.digest('hex');
};
