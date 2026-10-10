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

  const recentFirst = sortBy(active, [lastUsed, 'desc']);
  const runningTotals = recentFirst.reduce<number[]>((totals, { size }) => {
    totals.push((totals.at(-1) ?? 0) + size);

    return totals;
  }, []);
  const overflow = recentFirst.filter((_, index) => runningTotals[index] > maxBytes);

  return [...idle, ...overflow].map(({ path }) => path);
};
