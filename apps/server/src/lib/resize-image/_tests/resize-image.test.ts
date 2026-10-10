import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { resizeImage } from '../resize-image';

const PHOTO = await sharp({
  create: { width: 2000, height: 1000, channels: 3, background: '#3366ff' }
})
  .jpeg()
  .toBuffer();

const SVG = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>'
);

describe('resizeImage', () => {
  it('scales down to the requested width as webp, keeping the aspect ratio', async () => {
    const resized = await resizeImage({ buffer: PHOTO, width: 640, quality: 75 });
    const { format } = await sharp(resized?.buffer).metadata();

    expect(format).toBe('webp');
    expect(resized).toMatchObject({ width: 640, height: 320 });
  });

  it('never enlarges past the original width', async () => {
    const resized = await resizeImage({ buffer: PHOTO, width: 3840, quality: 75 });

    expect(resized).toMatchObject({ width: 2000, height: 1000 });
  });

  it('refuses to rasterise an svg', async () => {
    await expect(resizeImage({ buffer: SVG, width: 64, quality: 75 })).resolves.toBeNull();
  });

  it('returns null for bytes that are not an image', async () => {
    await expect(
      resizeImage({ buffer: Buffer.from('nope'), width: 64, quality: 75 })
    ).resolves.toBeNull();
  });
});
