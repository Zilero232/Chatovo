import iconv from 'iconv-lite';
import { describe, expect, it } from 'vitest';

import { decodeHtml } from '../decode-html';

const TEXT = 'Привет, мир';

describe('decodeHtml', () => {
  it('decodes utf-8 by default', () => {
    expect(decodeHtml({ body: Buffer.from(TEXT), contentType: 'text/html' })).toBe(TEXT);
  });

  it('honours the charset from the content-type header', () => {
    const body = iconv.encode(TEXT, 'win1251');

    expect(decodeHtml({ body, contentType: 'text/html; charset=windows-1251' })).toBe(TEXT);
  });

  it('falls back to the meta charset when the header has none', () => {
    const body = iconv.encode(`<meta charset="windows-1251"><p>${TEXT}</p>`, 'win1251');

    expect(decodeHtml({ body, contentType: 'text/html' })).toContain(TEXT);
  });

  it('survives a malformed content-type header', () => {
    expect(decodeHtml({ body: Buffer.from(TEXT), contentType: ';;;' })).toBe(TEXT);
  });

  it('treats a response without a content type as html', () => {
    expect(decodeHtml({ body: Buffer.from(TEXT), contentType: '' })).toBe(TEXT);
  });

  it('accepts xhtml', () => {
    expect(decodeHtml({ body: Buffer.from(TEXT), contentType: 'application/xhtml+xml' })).toBe(
      TEXT
    );
  });

  it('returns null for a response that is not html', () => {
    expect(decodeHtml({ body: Buffer.from('{}'), contentType: 'application/json' })).toBeNull();
  });
});
