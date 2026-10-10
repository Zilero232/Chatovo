import type { FileStat } from '../list-file-stats';

export type SelectEvictionsInput = {
  files: FileStat[];
  now: number;
  maxIdleMs: number;
  maxBytes?: number;
  clock?: 'accessed' | 'modified';
};
