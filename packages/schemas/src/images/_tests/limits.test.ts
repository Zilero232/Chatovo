import { describe, expect, it } from 'vitest';

import { IMAGE_PROCESSABLE_MIMES } from '../limits';

describe('IMAGE_PROCESSABLE_MIMES', () => {
  it.each(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'])(
    'covers %s, so old attachments of that type still go through the optimizer',
    (mime) => {
      expect(IMAGE_PROCESSABLE_MIMES).toContain(mime);
    }
  );

  it.each(['image/svg+xml', 'image/heic', 'image/bmp'])(
    'leaves out %s, which sharp cannot or must not rasterise',
    (mime) => {
      expect(IMAGE_PROCESSABLE_MIMES).not.toContain(mime);
    }
  );
});
