import { resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

import { resolveImageSource } from '../resolve-image-source';

const FILES_ORIGIN = 'https://api.chatovo.ru';
const UPLOADS_DIR = resolve('/srv/uploads');

const resolveFrom = (url: string) =>
  resolveImageSource({ url, filesOrigin: FILES_ORIGIN, uploadsDir: UPLOADS_DIR });

describe('resolveImageSource', () => {
  it('maps an upload url to its file on disk, ignoring the cache-busting query', () => {
    expect(resolveFrom('https://api.chatovo.ru/uploads/avatars/u1/avatar.webp?v=17')).toEqual({
      kind: 'upload',
      path: `${UPLOADS_DIR}${sep}avatars${sep}u1${sep}avatar.webp`
    });
  });

  it('decodes an encoded upload path', () => {
    expect(resolveFrom('https://api.chatovo.ru/uploads/chat/%D1%84%D0%BE%D1%82%D0%BE.png')).toEqual(
      {
        kind: 'upload',
        path: `${UPLOADS_DIR}${sep}chat${sep}фото.png`
      }
    );
  });

  it('refuses an encoded path traversal out of the uploads folder', () => {
    expect(resolveFrom('https://api.chatovo.ru/uploads/%2e%2e/%2e%2e/etc/passwd')).toBeNull();
  });

  it('refuses an encoded backslash traversal', () => {
    expect(resolveFrom('https://api.chatovo.ru/uploads/..%5C..%5Cetc%5Cpasswd')).toBeNull();
  });

  it('refuses a key carrying a NUL byte', () => {
    expect(resolveFrom('https://api.chatovo.ru/uploads/avatar.webp%00.png')).toBeNull();
  });

  it('refuses the uploads folder itself', () => {
    expect(resolveFrom('https://api.chatovo.ru/uploads/')).toBeNull();
  });

  it('refuses a malformed escape instead of throwing', () => {
    expect(resolveFrom('https://api.chatovo.ru/uploads/%E0%A4%A')).toBeNull();
  });

  it('refuses an upload path on another origin', () => {
    expect(resolveFrom('https://evil.example/uploads/avatars/u1/avatar.webp')).toBeNull();
  });

  it('refuses a server path outside /uploads', () => {
    expect(resolveFrom('https://api.chatovo.ru/health')).toBeNull();
  });

  it('accepts an allow-listed remote host over https', () => {
    expect(resolveFrom('https://avatars.githubusercontent.com/u/1?v=4')).toEqual({
      kind: 'remote',
      url: 'https://avatars.githubusercontent.com/u/1?v=4'
    });
  });

  it('refuses an allow-listed host over plain http', () => {
    expect(resolveFrom('http://avatars.githubusercontent.com/u/1?v=4')).toBeNull();
  });

  it('refuses a host that only ends with an allow-listed name', () => {
    expect(resolveFrom('https://evilavatars.githubusercontent.com.attacker.io/u/1')).toBeNull();
  });

  it('refuses an arbitrary remote host', () => {
    expect(resolveFrom('https://example.com/cat.png')).toBeNull();
  });
});
