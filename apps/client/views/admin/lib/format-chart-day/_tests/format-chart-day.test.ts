import { describe, expect, it } from 'vitest';

import { formatChartDay } from '../format-chart-day';

describe('formatChartDay', () => {
  it('formats an ISO day as a short label', () => {
    expect(formatChartDay('2026-09-03')).toBe('3 Sep');
  });

  it('returns an empty string for a missing date so the axis stays blank', () => {
    expect(formatChartDay('')).toBe('');
  });

  it('keeps the calendar day, not the UTC shift', () => {
    expect(formatChartDay('2026-01-01')).toBe('1 Jan');
  });
});
