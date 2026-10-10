import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { processChatImage } from '../process-chat-image';

const createSolid = (background: string) =>
  sharp({ create: { width: 300, height: 100, channels: 3, background } })
    .png()
    .toBuffer();

const PHOTO_WITH_EXIF = await sharp({
  create: { width: 4000, height: 2000, channels: 3, background: '#3366ff' }
})
  .jpeg()
  .withExif({ IFD0: { Copyright: 'camera-and-gps-data' } })
  .toBuffer();

const ROTATED_PHOTO = await sharp({
  create: { width: 400, height: 200, channels: 3, background: '#3366ff' }
})
  .jpeg()
  .withMetadata({ orientation: 6 })
  .toBuffer();

const SMALL_PNG = await createSolid('#3366ff');

const ANIMATED_GIF = await sharp([await createSolid('#3366ff'), await createSolid('#ff3366')], {
  join: { animated: true }
})
  .gif()
  .toBuffer();

describe('processChatImage', () => {
  it('reports the full size of the original', async () => {
    const result = await processChatImage({ buffer: PHOTO_WITH_EXIF, mime: 'image/jpeg' });

    expect(result).toMatchObject({ width: 4000, height: 2000 });
  });

  it('reports the size the image is displayed at when exif rotates it', async () => {
    const result = await processChatImage({ buffer: ROTATED_PHOTO, mime: 'image/jpeg' });

    expect(result).toMatchObject({ width: 200, height: 400 });
  });

  it('strips exif from the original and keeps its format', async () => {
    const result = await processChatImage({ buffer: PHOTO_WITH_EXIF, mime: 'image/jpeg' });
    const { exif, format } = await sharp(result?.original.buffer).metadata();

    expect(exif).toBeUndefined();
    expect(format).toBe('jpeg');
  });

  it('strips xmp metadata, where phones also put gps', async () => {
    const withXmp = await sharp({
      create: { width: 64, height: 64, channels: 3, background: '#3366ff' }
    })
      .jpeg()
      .withXmp(
        '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"/></x:xmpmeta>'
      )
      .toBuffer();
    const result = await processChatImage({ buffer: withXmp, mime: 'image/jpeg' });
    const { xmp } = await sharp(result?.original.buffer).metadata();

    expect(xmp).toBeUndefined();
  });

  it('keeps an original without metadata byte for byte', async () => {
    const result = await processChatImage({ buffer: SMALL_PNG, mime: 'image/png' });

    expect(result?.original.buffer).toBe(SMALL_PNG);
  });

  it('reports the height of a single frame for an animated image', async () => {
    const result = await processChatImage({ buffer: ANIMATED_GIF, mime: 'image/gif' });

    expect(result).toMatchObject({ width: 300, height: 100 });
  });

  it('produces a short webp data url as the placeholder', async () => {
    const result = await processChatImage({ buffer: PHOTO_WITH_EXIF, mime: 'image/jpeg' });

    expect(result?.placeholder.startsWith('data:image/webp;base64,')).toBe(true);
    expect(result?.placeholder.length).toBeLessThan(1024);
  });

  it('skips a format it does not process', async () => {
    await expect(
      processChatImage({ buffer: SMALL_PNG, mime: 'image/svg+xml' })
    ).resolves.toBeNull();
  });

  it('returns null for a corrupt image instead of throwing', async () => {
    await expect(
      processChatImage({ buffer: Buffer.from('broken'), mime: 'image/png' })
    ).resolves.toBeNull();
  });
});
