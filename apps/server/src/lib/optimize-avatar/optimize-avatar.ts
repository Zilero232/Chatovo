import { IMAGE_PROCESSING } from '../../config/uploads';
import { openImage } from '../open-image';

/**
 * Re-encodes an avatar as WebP within IMAGE_PROCESSING.avatar, keeping animation and dropping metadata.
 * Throws on a buffer that is not an image.
 */
export const optimizeAvatar = async (buffer: Buffer): Promise<Buffer> => {
  const { maxDimension, quality } = IMAGE_PROCESSING.avatar;

  return openImage(buffer)
    .resize({ width: maxDimension, height: maxDimension, fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
};
