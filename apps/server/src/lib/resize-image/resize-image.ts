import type { ResizedImage, ResizeImageInput } from './resize-image.types';

import { openImage } from '../open-image';

/**
 * Scales an image down to `width` (never up) as WebP, keeping animation. Null for an SVG,
 * which is never rasterised, or for bytes that don't decode as an image.
 */
export const resizeImage = async ({
  buffer,
  width,
  quality
}: ResizeImageInput): Promise<ResizedImage | null> => {
  try {
    const image = openImage(buffer);
    const { format } = await image.metadata();

    if (format === 'svg') {
      return null;
    }

    const { data, info } = await image
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer({ resolveWithObject: true });

    return { buffer: data, width: info.width, height: info.pageHeight ?? info.height };
  } catch {
    return null;
  }
};
