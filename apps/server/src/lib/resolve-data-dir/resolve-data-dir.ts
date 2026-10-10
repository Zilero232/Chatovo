import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVER_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

/** A data folder from the env: absolute as given, relative to apps/server otherwise (not to the cwd). */
export const resolveDataDir = (path: string): string =>
  isAbsolute(path) ? path : resolve(SERVER_ROOT, path);
