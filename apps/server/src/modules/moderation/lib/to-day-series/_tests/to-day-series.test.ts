import { describe, expect, it } from 'vitest';

import { toDaySeries } from '../to-day-series';

const from = new Date('2026-09-01T00:00:00.000Z');

describe('toDaySeries', () => {
  it('returns one point per day, gaps included', () => {
    const series = toDaySeries({ rows: [], from, days: 3 });

    expect(series).toHaveLength(3);
    expect(series.every((point) => point.count === 0)).toBe(true);
  });

  it('buckets rows into their own day', () => {
    const series = toDaySeries({
      rows: [{ createdAt: new Date('2026-09-02T10:00:00.000Z') }],
      from,
      days: 3
    });

    expect(series[1]?.count).toBe(1);
    expect(series[0]?.count).toBe(0);
  });

  it('counts several rows on the same day', () => {
    const rows = [
      { createdAt: new Date('2026-09-01T01:00:00.000Z') },
      { createdAt: new Date('2026-09-01T23:00:00.000Z') }
    ];

    expect(toDaySeries({ rows, from, days: 2 })[0]?.count).toBe(2);
  });

  it('ignores rows outside the window instead of throwing', () => {
    const rows = [{ createdAt: new Date('2020-01-01T00:00:00.000Z') }];
    const series = toDaySeries({ rows, from, days: 2 });

    expect(series.every((point) => point.count === 0)).toBe(true);
  });

  it('labels each point with an ISO day', () => {
    expect(toDaySeries({ rows: [], from, days: 1 })[0]?.date).toBe('2026-09-01');
  });
});
