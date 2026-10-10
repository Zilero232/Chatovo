import { describe, expect, it } from 'vitest';

import type { ChatAttachment, ChatAttachmentImage } from '../types';

import { decodeChatAttachment, encodeChatAttachment, isImageMime } from '../lib';
import { IMAGE_PLACEHOLDER_MAX_LENGTH } from '../limits';

const ATTACHMENT: ChatAttachment = {
  kind: 'attachment',
  url: 'https://chatovo.ru/uploads/cat.png',
  name: 'cat.png',
  size: 2048,
  mime: 'image/png'
};

const IMAGE: ChatAttachmentImage = {
  width: 1280,
  height: 720,
  placeholder: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
};

describe('chat attachment codec', () => {
  it('round-trips an attachment', () => {
    expect(decodeChatAttachment(encodeChatAttachment(ATTACHMENT))).toEqual(ATTACHMENT);
  });

  it('returns null for a plain text message', () => {
    expect(decodeChatAttachment('привет')).toBeNull();
  });

  it('returns null for malformed json instead of throwing', () => {
    expect(decodeChatAttachment('{ "kind": ')).toBeNull();
  });

  it('rejects json that is not an attachment', () => {
    expect(decodeChatAttachment(JSON.stringify({ kind: 'something-else' }))).toBeNull();
  });

  it('rejects an attachment with an invalid url', () => {
    expect(decodeChatAttachment(JSON.stringify({ ...ATTACHMENT, url: 'not-a-url' }))).toBeNull();
  });

  it('rejects a negative size', () => {
    expect(decodeChatAttachment(JSON.stringify({ ...ATTACHMENT, size: -1 }))).toBeNull();
  });

  it('accepts a zero-byte attachment', () => {
    expect(decodeChatAttachment(JSON.stringify({ ...ATTACHMENT, size: 0 }))).not.toBeNull();
  });

  it('round-trips an attachment carrying image metadata', () => {
    const attachment = { ...ATTACHMENT, image: IMAGE };

    expect(decodeChatAttachment(encodeChatAttachment(attachment))).toEqual(attachment);
  });

  it('rejects a placeholder that is not an inline webp', () => {
    const image = { ...IMAGE, placeholder: 'https://evil.example/track.png' };

    expect(decodeChatAttachment(JSON.stringify({ ...ATTACHMENT, image }))).toBeNull();
  });

  it('rejects a placeholder over the length cap', () => {
    const placeholder = `data:image/webp;base64,${'A'.repeat(IMAGE_PLACEHOLDER_MAX_LENGTH)}`;

    expect(
      decodeChatAttachment(JSON.stringify({ ...ATTACHMENT, image: { ...IMAGE, placeholder } }))
    ).toBeNull();
  });
});

describe('isImageMime', () => {
  it('accepts image mime types', () => {
    expect(isImageMime('image/png')).toBe(true);
    expect(isImageMime('image/svg+xml')).toBe(true);
  });

  it('rejects everything else', () => {
    expect(isImageMime('application/pdf')).toBe(false);
    expect(isImageMime('video/mp4')).toBe(false);
    expect(isImageMime('')).toBe(false);
  });
});
