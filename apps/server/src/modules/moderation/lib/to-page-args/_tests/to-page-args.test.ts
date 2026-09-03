import { describe, expect, it } from 'vitest';

import { toPageArgs } from '../to-page-args';

describe('toPageArgs', () => {
  it('skips nothing on the first page', () => {
    expect(toPageArgs({ page: 1, perPage: 20 })).toEqual({ skip: 0, take: 20 });
  });

  it('treats the page as 1-based, not 0-based', () => {
    expect(toPageArgs({ page: 2, perPage: 20 }).skip).toBe(20);
    expect(toPageArgs({ page: 3, perPage: 20 }).skip).toBe(40);
  });

  it('scales the offset with the page size', () => {
    expect(toPageArgs({ page: 4, perPage: 5 })).toEqual({ skip: 15, take: 5 });
  });

  it('never returns a negative skip', () => {
    expect(toPageArgs({ page: 1, perPage: 1 }).skip).toBe(0);
  });
});
