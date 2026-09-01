/**
 * Repairs a Multer `originalname`.
 *
 * Multer decodes the filename from the multipart headers as latin1, so any
 * non-ASCII name (Cyrillic, emoji, accents) arrives mojibaked. Re-encoding
 * those bytes as UTF-8 restores the original; a name that is already valid
 * ASCII passes through unchanged.
 */
export const decodeUploadName = (name: string): string => {
  const restored = Buffer.from(name, 'latin1').toString('utf8');

  return restored.includes('�') ? name : restored;
};
