import { describe, expect, it } from 'vitest';

import { buildHashKey } from '../build-hash-key';

const PARTS = ['https://api.chatovo.ru/uploads/a.png', 256, 75];

describe('buildHashKey', () => {
  it('is stable for the same parts', () => {
    expect(buildHashKey(PARTS)).toBe(buildHashKey([...PARTS]));
  });

  it('is a hex digest safe to use as a file name', () => {
    expect(buildHashKey(PARTS)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes when any part changes', () => {
    const keys = new Set([
      buildHashKey(PARTS),
      buildHashKey(['https://api.chatovo.ru/uploads/a.png', 384, 75]),
      buildHashKey(['https://api.chatovo.ru/uploads/a.png', 256, 90]),
      buildHashKey(['https://api.chatovo.ru/uploads/a.png?v=2', 256, 75])
    ]);

    expect(keys.size).toBe(4);
  });

  it('hashes raw bytes the same as the equal text', () => {
    expect(buildHashKey([Buffer.from('image-bytes')])).toBe(buildHashKey(['image-bytes']));
  });

  it('does not let one part bleed into the next', () => {
    expect(buildHashKey(['a', 'bc'])).not.toBe(buildHashKey(['ab', 'c']));
  });
});
