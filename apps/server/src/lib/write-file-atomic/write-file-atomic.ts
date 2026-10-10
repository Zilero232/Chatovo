import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { WriteFileAtomicInput } from './write-file-atomic.types';

import { UPLOADS } from '../../config/uploads';

/**
 * Writes through a uniquely named temporary file and renames it into place, so a reader never
 * sees half a file. Creates the parent folder. Leftover temporaries end in UPLOADS.temporarySuffix.
 */
export const writeFileAtomic = async ({ path, data }: WriteFileAtomicInput): Promise<void> => {
  const temporary = `${path}.${crypto.randomUUID()}${UPLOADS.temporarySuffix}`;

  await mkdir(dirname(path), { recursive: true });
  await writeFile(temporary, data);
  await rename(temporary, path);
};
