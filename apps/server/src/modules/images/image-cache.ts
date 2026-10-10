import { differenceInMilliseconds } from 'date-fns';
import { readFile, stat, utimes } from 'node:fs/promises';
import { join } from 'node:path';

import type { FileStat } from '../../lib';
import type { ReadCachedImageInput, WriteCachedImageInput } from './images.types';

import { env } from '../../core';
import { listFileStats, resolveDataDir, writeFileAtomic } from '../../lib';
import { IMAGES } from './config';

const IMAGE_CACHE_DIR = resolveDataDir(env.IMAGE_CACHE_DIR);

const cachePath = (key: string): string => join(IMAGE_CACHE_DIR, key.slice(0, 2), `${key}.webp`);

const markAccessed = async ({ path, accessedMs, modifiedMs }: FileStat): Promise<void> => {
  if (differenceInMilliseconds(Date.now(), accessedMs) < IMAGES.cache.touchAfterMs) {
    return;
  }

  await utimes(path, new Date(), new Date(modifiedMs)).catch(() => undefined);
};

export const readCachedImage = async ({
  key,
  maxAgeMs
}: ReadCachedImageInput): Promise<Buffer | null> => {
  const path = cachePath(key);

  try {
    const { size, atimeMs, mtimeMs } = await stat(path);

    if (maxAgeMs !== undefined && differenceInMilliseconds(Date.now(), mtimeMs) > maxAgeMs) {
      return null;
    }

    const buffer = await readFile(path);

    await markAccessed({ path, size, accessedMs: atimeMs, modifiedMs: mtimeMs });

    return buffer;
  } catch {
    return null;
  }
};

export const writeCachedImage = async ({ key, buffer }: WriteCachedImageInput): Promise<void> => {
  await writeFileAtomic({ path: cachePath(key), data: buffer });
};

export const listCachedImages = (): Promise<FileStat[]> => listFileStats(IMAGE_CACHE_DIR);
