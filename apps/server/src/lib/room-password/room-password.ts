import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

const PREFIX = 'scrypt';
const KEY_LENGTH = 32;

const derive = async (password: string, salt: string): Promise<Buffer> =>
  (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

/** Hashes a room password for storage as `scrypt:<salt>:<key>`. */
export const hashRoomPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt);

  return `${PREFIX}:${salt}:${key.toString('hex')}`;
};

/** True when a stored value is already hashed rather than legacy plaintext. */
export const isHashedRoomPassword = (stored: string): boolean => stored.startsWith(`${PREFIX}:`);

/**
 * Verifies a room password against the stored value. Legacy plaintext rows are
 * compared directly so rooms created before hashing keep working.
 */
export const verifyRoomPassword = async (password: string, stored: string): Promise<boolean> => {
  if (!isHashedRoomPassword(stored)) {
    return password === stored;
  }

  const [, salt, key] = stored.split(':');

  if (!salt || !key) {
    return false;
  }

  const expected = Buffer.from(key, 'hex');
  const actual = await derive(password, salt);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
};
