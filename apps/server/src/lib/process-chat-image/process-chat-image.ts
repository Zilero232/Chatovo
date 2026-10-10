import sharp from 'sharp';
import { match } from 'ts-pattern';

import type {
  ImageDimensions,
  ProcessChatImageInput,
  ProcessedChatImage
} from './process-chat-image.types';

import { UPLOADS } from '../../config/uploads';
import { openImage } from '../open-image';

const stripMetadata = async ({
  buffer,
  mime
}: ProcessChatImageInput): Promise<ProcessChatImageInput> => {
  const { exif, xmp, iptc } = await sharp(buffer, {
    limitInputPixels: UPLOADS.image.maxInputPixels
  }).metadata();

  if (!exif && !xmp && !iptc) {
    return { buffer, mime };
  }

  const image = openImage(buffer);
  const reencoded = match(mime)
    .with('image/jpeg', () =>
      image.jpeg({ quality: UPLOADS.image.chatOriginalQuality, mozjpeg: true })
    )
    .with('image/png', () => image.png())
    .with('image/webp', () => image.webp({ quality: UPLOADS.image.chatOriginalQuality }))
    .with('image/avif', () => image.avif({ quality: UPLOADS.image.chatOriginalQuality }))
    .with('image/gif', () => image.gif())
    .otherwise(() => null);

  return reencoded ? { buffer: await reencoded.toBuffer(), mime } : { buffer, mime };
};

const readDimensions = async (buffer: Buffer): Promise<ImageDimensions> => {
  const { autoOrient, pageHeight } = await sharp(buffer, {
    animated: true,
    limitInputPixels: UPLOADS.image.maxInputPixels
  }).metadata();

  return { width: autoOrient.width, height: pageHeight ?? autoOrient.height };
};

const renderPlaceholder = async (buffer: Buffer): Promise<string> => {
  const placeholder = await sharp(buffer, { limitInputPixels: UPLOADS.image.maxInputPixels })
    .autoOrient()
    .resize({
      width: UPLOADS.image.placeholder.dimension,
      height: UPLOADS.image.placeholder.dimension,
      fit: 'inside'
    })
    .webp({ quality: UPLOADS.image.placeholder.quality })
    .toBuffer();

  return `data:image/webp;base64,${placeholder.toString('base64')}`;
};

/**
 * Reads an image's displayed size and a tiny blurred placeholder, and strips EXIF from the original.
 * Null for a format it doesn't handle or an image that fails to decode.
 */
export const processChatImage = async ({
  buffer,
  mime
}: ProcessChatImageInput): Promise<ProcessedChatImage | null> => {
  if (!UPLOADS.image.processableMimes.has(mime)) {
    return null;
  }

  try {
    const [dimensions, placeholder, original] = await Promise.all([
      readDimensions(buffer),
      renderPlaceholder(buffer),
      stripMetadata({ buffer, mime })
    ]);

    return { ...dimensions, original, placeholder };
  } catch {
    return null;
  }
};
