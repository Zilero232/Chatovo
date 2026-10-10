import { rm } from 'node:fs/promises';

/** Deletes the given files, ignoring ones already gone. Resolves to how many were removed. */
export const removeFiles = async (paths: string[]): Promise<number> => {
  const results = await Promise.allSettled(paths.map((path) => rm(path, { force: true })));

  return results.filter(({ status }) => status === 'fulfilled').length;
};
