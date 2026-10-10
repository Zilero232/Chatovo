import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

import type { FileStat } from './list-file-stats.types';

const readFileStat = async (path: string): Promise<FileStat> => {
  const { size, atimeMs, mtimeMs } = await stat(path);

  return { path, size, accessedMs: atimeMs, modifiedMs: mtimeMs };
};

/** Every file under `directory`, recursively, with size and access/modify times. Empty when the folder is missing. */
export const listFileStats = async (directory: string): Promise<FileStat[]> => {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true }).catch(
    () => []
  );
  const paths = entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
  const results = await Promise.allSettled(paths.map(readFileStat));

  return results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
};
