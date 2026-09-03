import { describe, expect, it } from 'vitest';

import { formatAdminDate } from '../format-admin-date';

describe('formatAdminDate', () => {
  it('always shows the year, unlike the relative chat formatter', () => {
    expect(formatAdminDate('2026-09-03T12:30:00.000Z')).toContain('2026');
  });

  it('keeps day, month and time in one label', () => {
    const label = formatAdminDate('2026-09-03T12:30:00.000Z');

    expect(label).toMatch(/^\d{1,2} \w{3} \d{4}, \d{2}:\d{2}$/);
  });

  it('does not fall back to a relative word for today', () => {
    expect(formatAdminDate(new Date().toISOString())).not.toMatch(/today|yesterday/i);
  });
});
