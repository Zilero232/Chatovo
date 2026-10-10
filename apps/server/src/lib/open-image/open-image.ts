import type { Sharp } from 'sharp';

import sharp from 'sharp';

import { UPLOADS } from '../../config/uploads';

/**
 * Opens an upload for re-encoding: every animation frame, EXIF orientation applied,
 * decompression bombs past UPLOADS.image.maxInputPixels rejected.
 */
export const openImage = (buffer: Buffer): Sharp =>
  sharp(buffer, { animated: true, limitInputPixels: UPLOADS.image.maxInputPixels }).autoOrient();
