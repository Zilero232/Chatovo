import { describe, expect, it } from 'vitest';

import { optimizeImageQuerySchema } from '../inputs';

const SOURCE = 'https://api.chatovo.ru/uploads/avatars/u1/avatar.webp?v=1';

describe('optimizeImageQuerySchema', () => {
  it('coerces the width and quality that arrive as query strings', () => {
    expect(optimizeImageQuerySchema.parse({ url: SOURCE, w: '256', q: '90' })).toEqual({
      url: SOURCE,
      w: 256,
      q: 90
    });
  });

  it('defaults the quality when it is omitted', () => {
    expect(optimizeImageQuerySchema.parse({ url: SOURCE, w: '64' }).q).toBe(75);
  });

  it('rejects a width outside the allowed set, so the cache cannot be flooded', () => {
    expect(optimizeImageQuerySchema.safeParse({ url: SOURCE, w: '257' }).success).toBe(false);
  });

  it('rejects a quality outside the allowed set', () => {
    expect(optimizeImageQuerySchema.safeParse({ url: SOURCE, w: '64', q: '100' }).success).toBe(
      false
    );
  });

  it('rejects a source with a non-http protocol', () => {
    expect(optimizeImageQuerySchema.safeParse({ url: 'file:///etc/passwd', w: '64' }).success).toBe(
      false
    );
  });
});
