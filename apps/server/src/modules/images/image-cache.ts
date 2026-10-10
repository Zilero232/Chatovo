import { differenceInMilliseconds } from 'date-fns';
import { mkdir, readFile, rename, stat, utimes, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { FileStat } from '../../lib';
import type { ReadCachedImageInput, WriteCachedImageInput } from './images.types';

import { env } from '../../core';
import { listFileStats } from '../../lib';
import { IMAGES } from './config';

const SERVER_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const IMAGE_CACHE_DIR = isAbsolute(env.IMAGE_CACHE_DIR)
  ? env.IMAGE_CACHE_DIR
  : resolve(SERVER_ROOT, env.IMAGE_CACHE_DIR);

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
  const path = cachePath(key);
  const temporary = `${path}.${crypto.randomUUID()}${IMAGES.cache.temporarySuffix}`;

  await mkdir(dirname(path), { recursive: true });
  await writeFile(temporary, buffer);
  await rename(temporary, path);
};

export const listCachedImages = (): Promise<FileStat[]> => listFileStats(IMAGE_CACHE_DIR);
