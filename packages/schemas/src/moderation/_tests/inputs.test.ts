import { describe, expect, it } from 'vitest';

import { blockUserSchema, reportAbuseSchema } from '../inputs';

const base = { target: 'user' as const, targetId: 'user-1', reason: 'spam' as const };

describe('reportAbuseSchema', () => {
  it('accepts a report without a comment', () => {
    expect(reportAbuseSchema.safeParse(base).success).toBe(true);
  });

  it('turns an empty comment into undefined so the server stores null', () => {
    const parsed = reportAbuseSchema.parse({ ...base, comment: '' });

    expect(parsed.comment).toBeUndefined();
  });

  it('trims a comment', () => {
    expect(reportAbuseSchema.parse({ ...base, comment: '  rude  ' }).comment).toBe('rude');
  });

  it('rejects a comment over 2000 characters', () => {
    const result = reportAbuseSchema.safeParse({ ...base, comment: 'x'.repeat(2001) });

    expect(result.success).toBe(false);
  });

  it('rejects an unknown reason', () => {
    expect(reportAbuseSchema.safeParse({ ...base, reason: 'because' }).success).toBe(false);
  });

  it('rejects an unknown target', () => {
    expect(reportAbuseSchema.safeParse({ ...base, target: 'avatar' }).success).toBe(false);
  });

  it('rejects an empty targetId', () => {
    expect(reportAbuseSchema.safeParse({ ...base, targetId: '' }).success).toBe(false);
  });
});

describe('blockUserSchema', () => {
  it('requires a reason of at least three characters', () => {
    expect(blockUserSchema.safeParse({ reason: 'ab' }).success).toBe(false);
    expect(blockUserSchema.safeParse({ reason: 'spam' }).success).toBe(true);
  });

  it('rejects a reason over 500 characters', () => {
    expect(blockUserSchema.safeParse({ reason: 'x'.repeat(501) }).success).toBe(false);
  });

  it('rejects whitespace that trims below the minimum', () => {
    expect(blockUserSchema.safeParse({ reason: '   ' }).success).toBe(false);
  });
});
