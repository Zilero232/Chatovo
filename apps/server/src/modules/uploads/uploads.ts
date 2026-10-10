import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { UPLOADS_ROUTE } from '../../config/uploads';
import { env } from '../../core';

const SERVER_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

export const UPLOADS_DIR = isAbsolute(env.UPLOADS_DIR)
  ? env.UPLOADS_DIR
  : resolve(SERVER_ROOT, env.UPLOADS_DIR);

export const toArrayBuffer = (buffer: Buffer): ArrayBuffer => {
  const result = new ArrayBuffer(buffer.byteLength);

  new Uint8Array(result).set(buffer);

  return result;
};

export const saveUpload = async (key: string, body: ArrayBuffer): Promise<string> => {
  const target = join(UPLOADS_DIR, key);
  const temporary = `${target}.${crypto.randomUUID()}.tmp`;

  await mkdir(dirname(target), { recursive: true });
  await writeFile(temporary, Buffer.from(body));
  await rename(temporary, target);

  return `${env.PUBLIC_FILES_URL}${UPLOADS_ROUTE}/${key}`;
};

export const deleteUpload = async (key: string): Promise<void> => {
  await rm(join(UPLOADS_DIR, key), { force: true });
};

export const deleteUploadDirectory = async (key: string): Promise<void> => {
  await rm(join(UPLOADS_DIR, key), { force: true, recursive: true });
};
