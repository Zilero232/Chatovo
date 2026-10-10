import { rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import type { DeleteUploadsBesideInput } from './uploads.types';

import { UPLOADS } from '../../config/uploads';
import { env } from '../../core';
import { listFileStats } from '../../lib/list-file-stats';
import { removeFiles } from '../../lib/remove-files';
import { resolveDataDir } from '../../lib/resolve-data-dir';
import { writeFileAtomic } from '../../lib/write-file-atomic';

export const UPLOADS_DIR = resolveDataDir(env.UPLOADS_DIR);

export const toArrayBuffer = (buffer: Buffer): ArrayBuffer => {
  const result = new ArrayBuffer(buffer.byteLength);

  new Uint8Array(result).set(buffer);

  return result;
};

export const saveUpload = async (key: string, body: ArrayBuffer): Promise<string> => {
  await writeFileAtomic({ path: join(UPLOADS_DIR, key), data: new Uint8Array(body) });

  return `${env.PUBLIC_FILES_URL}${UPLOADS.route}/${key}`;
};

export const deleteUpload = async (key: string): Promise<void> => {
  await rm(join(UPLOADS_DIR, key), { force: true });
};

export const deleteUploadDirectory = async (key: string): Promise<void> => {
  await rm(join(UPLOADS_DIR, key), { force: true, recursive: true });
};

export const deleteUploadsBeside = async ({ key }: DeleteUploadsBesideInput): Promise<void> => {
  const kept = join(UPLOADS_DIR, key);
  const siblings = await listFileStats(dirname(kept));

  await removeFiles(siblings.map(({ path }) => path).filter((path) => path !== kept));
};
