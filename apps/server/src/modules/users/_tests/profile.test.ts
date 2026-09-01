import { describe, expect, it } from 'vitest';

import { resolveDisplayName } from '../profile';

const USER_ID = 'usr_01';

describe('resolveDisplayName', () => {
  it('prefers the profile display name', () => {
    expect(resolveDisplayName({ displayName: 'Alex', name: 'fallback', userId: USER_ID })).toBe(
      'Alex'
    );
  });

  it('falls back to the account name when there is no display name', () => {
    expect(resolveDisplayName({ displayName: null, name: 'Alex', userId: USER_ID })).toBe('Alex');
  });

  it('falls back to the user id when both names are missing', () => {
    expect(resolveDisplayName({ displayName: null, name: undefined, userId: USER_ID })).toBe(
      USER_ID
    );
  });

  it('treats blank names as missing', () => {
    expect(resolveDisplayName({ displayName: '   ', name: '', userId: USER_ID })).toBe(USER_ID);
  });

  it('never leaks an email domain into the UI', () => {
    expect(
      resolveDisplayName({ displayName: 'alex@gmail.com', name: undefined, userId: USER_ID })
    ).toBe('alex');
  });

  it('strips the domain from the account name too', () => {
    expect(resolveDisplayName({ displayName: null, name: 'alex@gmail.com', userId: USER_ID })).toBe(
      'alex'
    );
  });

  it('falls back to the user id when the email has no local part', () => {
    expect(
      resolveDisplayName({ displayName: '@gmail.com', name: undefined, userId: USER_ID })
    ).toBe(USER_ID);
  });

  it('trims surrounding whitespace', () => {
    expect(resolveDisplayName({ displayName: '  Alex  ', name: undefined, userId: USER_ID })).toBe(
      'Alex'
    );
  });
});
