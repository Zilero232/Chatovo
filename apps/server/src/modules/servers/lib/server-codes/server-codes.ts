import { INVITE_CODE_LENGTH, SERVER_SLUG_MAX_LENGTH } from '@chatovo/schemas';

const CODE_ALPHABET = 'abcdefghijkmnopqrstuvwxyz23456789';

/** Slugifies a server name into a url-safe base; collisions are resolved by the caller. */
export const toServerSlugBase = (name: string) => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SERVER_SLUG_MAX_LENGTH);

  return slug.length >= 2 ? slug : 'server';
};

export const generateInviteCode = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(INVITE_CODE_LENGTH));

  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('');
};
