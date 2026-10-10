import type { ResizedImage, ResizeImageInput } from './resize-image.types';

import { UPLOADS } from '../../config/uploads';
import { openImage } from '../open-image';

/**
 * Scales an image down to `width` (never up) as WebP, keeping animation. Null for anything
 * outside UPLOADS.image.decodableFormats — an SVG is never rasterised — or bytes that fail to decode.
 */
export const resizeImage = async ({
  buffer,
  width,
  quality
}: ResizeImageInput): Promise<ResizedImage | null> => {
  try {
    const image = openImage(buffer);
    const { format } = await image.metadata();

    if (!format || !UPLOADS.image.decodableFormats.has(format)) {
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
