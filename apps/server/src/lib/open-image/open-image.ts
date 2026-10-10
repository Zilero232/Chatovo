import type { Sharp } from 'sharp';

import sharp from 'sharp';

import { IMAGE_PROCESSING } from '../../config/uploads';

/**
 * Opens an upload for re-encoding: every animation frame, EXIF orientation applied,
 * decompression bombs past IMAGE_PROCESSING.maxInputPixels rejected.
 */
export const openImage = (buffer: Buffer): Sharp =>
  sharp(buffer, { animated: true, limitInputPixels: IMAGE_PROCESSING.maxInputPixels }).autoOrient();
