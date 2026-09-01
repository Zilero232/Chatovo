import { describe, expect, it } from 'vitest';

import { normalizeFriendTag } from '../mappers';

describe('normalizeFriendTag', () => {
  it('lowercases the tag so lookups are case-insensitive', () => {
    expect(normalizeFriendTag('Alex#4821')).toBe('alex#4821');
    expect(normalizeFriendTag('ALEX#4821')).toBe('alex#4821');
  });

  it('trims surrounding whitespace from a pasted tag', () => {
    expect(normalizeFriendTag('  alex#4821  ')).toBe('alex#4821');
  });

  it('keeps the discriminator intact', () => {
    expect(normalizeFriendTag('alex#0001')).toBe('alex#0001');
  });

  it('leaves an already-normalized tag unchanged', () => {
    expect(normalizeFriendTag('alex#4821')).toBe('alex#4821');
  });

  it('handles an empty string', () => {
    expect(normalizeFriendTag('   ')).toBe('');
  });
});
