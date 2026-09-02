import { describe, expect, it } from 'vitest';

import { resolveInvisible } from '../resolve-invisible';

describe('resolveInvisible', () => {
  it('lets an admin who asked be invisible', () => {
    expect(resolveInvisible({ requested: true, isAdmin: true })).toBe(true);
  });

  it('refuses a non-admin who forged the flag — the core security guarantee', () => {
    expect(resolveInvisible({ requested: true, isAdmin: false })).toBe(false);
  });

  it('keeps an admin visible when they did not ask', () => {
    expect(resolveInvisible({ requested: false, isAdmin: true })).toBe(false);
  });

  it('treats a missing flag as not requested', () => {
    expect(resolveInvisible({ isAdmin: true })).toBe(false);
  });

  it('is false for a plain user by default', () => {
    expect(resolveInvisible({ isAdmin: false })).toBe(false);
  });
});
