import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { optimizeAvatar } from '../optimize-avatar';

const createSolid = (background: string) =>
  sharp({ create: { width: 300, height: 100, channels: 3, background } })
    .png()
    .toBuffer();

const LARGE_PHOTO = await sharp({
  create: { width: 4000, height: 2000, channels: 3, background: '#3366ff' }
})
  .jpeg()
  .toBuffer();

const ANIMATED_GIF = await sharp([await createSolid('#3366ff'), await createSolid('#ff3366')], {
  join: { animated: true }
})
  .gif()
  .toBuffer();

describe('optimizeAvatar', () => {
  it('re-encodes a large photo as webp within the size cap, keeping its proportions', async () => {
    const { format, width, height } = await sharp(await optimizeAvatar(LARGE_PHOTO)).metadata();

    expect(format).toBe('webp');
    expect(width).toBe(768);
    expect(height).toBe(384);
  });

  it('keeps an animated avatar animated', async () => {
    const { pages } = await sharp(await optimizeAvatar(ANIMATED_GIF)).metadata();

    expect(pages).toBe(2);
  });

  it('throws on a buffer that is not an image', async () => {
    await expect(optimizeAvatar(Buffer.from('not an image'))).rejects.toThrow();
  });
});
