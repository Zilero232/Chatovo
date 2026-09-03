import { addDays } from 'date-fns';

import type { ToDaySeriesInput } from './to-day-series.types';

const toUtcDayKey = (date: Date): string => date.toISOString().slice(0, 10);

/**
 * Buckets rows into one point per UTC day, keeping empty days at zero so a
 * chart has no gaps. Local-time bucketing would shift late-evening rows into
 * the next day and drop the last day of the window.
 */
export const toDaySeries = ({ rows, from, days }: ToDaySeriesInput) => {
  const buckets = new Map<string, number>();

  for (let index = 0; index < days; index += 1) {
    buckets.set(toUtcDayKey(addDays(from, index)), 0);
  }

  for (const row of rows) {
    const key = toUtcDayKey(row.createdAt);
    const current = buckets.get(key);

    if (current !== undefined) {
      buckets.set(key, current + 1);
    }
  }

  return [...buckets].map(([date, count]) => ({ date, count }));
};
