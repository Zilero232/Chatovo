import { describe, expect, it } from 'vitest';

import { decodeUploadName } from '../decode-upload-name';

const asMulterName = (name: string): string => Buffer.from(name, 'utf8').toString('latin1');

describe('decodeUploadName', () => {
  it('restores a Cyrillic name mangled by multer', () => {
    expect(decodeUploadName(asMulterName('Снимок экрана.png'))).toBe('Снимок экрана.png');
  });

  it('restores accented latin characters', () => {
    expect(decodeUploadName(asMulterName('résumé final.pdf'))).toBe('résumé final.pdf');
  });

  it('restores emoji in a filename', () => {
    expect(decodeUploadName(asMulterName('screenshot 🎮.png'))).toBe('screenshot 🎮.png');
  });

  it('leaves a plain ASCII name untouched', () => {
    expect(decodeUploadName('report-2026.pdf')).toBe('report-2026.pdf');
  });

  it('keeps the extension intact', () => {
    expect(decodeUploadName(asMulterName('документ.docx')).endsWith('.docx')).toBe(true);
  });

  it('handles an empty name', () => {
    expect(decodeUploadName('')).toBe('');
  });
});
