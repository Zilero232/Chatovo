import { describe, expect, it } from 'vitest';

import { selectEvictions } from '../select-evictions';

const DAY = 86_400_000;
const NOW = 100 * DAY;

const file = (path: string, size: number, accessedDaysAgo: number, modifiedDaysAgo = 50) => ({
  path,
  size,
  accessedMs: NOW - accessedDaysAgo * DAY,
  modifiedMs: NOW - modifiedDaysAgo * DAY
});

describe('selectEvictions', () => {
  it('evicts only what has been idle longer than the limit', () => {
    const files = [file('fresh', 10, 1), file('stale', 10, 20)];

    expect(selectEvictions({ files, now: NOW, maxIdleMs: 14 * DAY })).toEqual(['stale']);
  });

  it('keeps a file idle for exactly the limit', () => {
    expect(
      selectEvictions({ files: [file('edge', 10, 14)], now: NOW, maxIdleMs: 14 * DAY })
    ).toEqual([]);
  });

  it('drops the least recently used first when over the size budget', () => {
    const files = [file('newest', 40, 1), file('middle', 40, 3), file('oldest', 40, 5)];

    expect(selectEvictions({ files, now: NOW, maxIdleMs: 14 * DAY, maxBytes: 80 })).toEqual([
      'oldest'
    ]);
  });

  it('combines idle and over-budget evictions without duplicates', () => {
    const files = [file('a', 60, 1), file('b', 60, 2), file('idle', 5, 30)];

    expect(selectEvictions({ files, now: NOW, maxIdleMs: 14 * DAY, maxBytes: 100 })).toEqual([
      'idle',
      'b'
    ]);
  });

  it('can age files by modification time instead of access', () => {
    const files = [file('rewritten', 10, 40, 1), file('old', 10, 1, 40)];

    expect(selectEvictions({ files, now: NOW, maxIdleMs: 30 * DAY, clock: 'modified' })).toEqual([
      'old'
    ]);
  });

  it('returns nothing for an empty cache', () => {
    expect(selectEvictions({ files: [], now: NOW, maxIdleMs: DAY })).toEqual([]);
  });
});
