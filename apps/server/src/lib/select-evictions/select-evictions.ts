import { partition, sortBy } from 'remeda';

import type { FileStat } from '../list-file-stats';
import type { SelectEvictionsInput } from './select-evictions.types';

/**
 * Paths to delete from a file cache: everything idle longer than `maxIdleMs`, then the least
 * recently used until the rest fits in `maxBytes` — the `inactive` + `max_size` policy of nginx's proxy_cache.
 */
export const selectEvictions = ({
  files,
  now,
  maxIdleMs,
  maxBytes = Infinity,
  clock = 'accessed'
}: SelectEvictionsInput): string[] => {
  const lastUsed = (file: FileStat) => (clock === 'accessed' ? file.accessedMs : file.modifiedMs);
  const [idle, active] = partition(files, (file) => now - lastUsed(file) > maxIdleMs);

  let keptBytes = 0;
  const overflow = sortBy(active, [lastUsed, 'desc']).filter((file) => {
    keptBytes += file.size;

    return keptBytes > maxBytes;
  });

  return [...idle, ...overflow].map(({ path }) => path);
};
