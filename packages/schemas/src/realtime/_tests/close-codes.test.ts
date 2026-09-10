import { describe, expect, it } from 'vitest';

import {
  isPrivilegesChangedCloseCode,
  isSessionEndedCloseCode,
  WS_CLOSE_CODE
} from '../close-codes';

describe('isSessionEndedCloseCode', () => {
  it('ends the session for a blocked account', () => {
    expect(isSessionEndedCloseCode(WS_CLOSE_CODE.blocked)).toBe(true);
  });

  it('keeps the session when only the role changed, so the user is not signed out', () => {
    expect(isSessionEndedCloseCode(WS_CLOSE_CODE.roleChanged)).toBe(false);
  });

  it('ignores an ordinary close, which must keep reconnecting', () => {
    expect(isSessionEndedCloseCode(1000)).toBe(false);
    expect(isSessionEndedCloseCode(1006)).toBe(false);
  });
});

describe('isPrivilegesChangedCloseCode', () => {
  it('recognises a role change so the client can refetch its session', () => {
    expect(isPrivilegesChangedCloseCode(WS_CLOSE_CODE.roleChanged)).toBe(true);
  });

  it('does not confuse a block with a privilege change', () => {
    expect(isPrivilegesChangedCloseCode(WS_CLOSE_CODE.blocked)).toBe(false);
  });

  it('ignores an ordinary close', () => {
    expect(isPrivilegesChangedCloseCode(1006)).toBe(false);
  });
});

describe('WS_CLOSE_CODE', () => {
  it('stays in the private range so it never collides with a protocol code', () => {
    for (const code of Object.values(WS_CLOSE_CODE)) {
      expect(code).toBeGreaterThanOrEqual(4000);
      expect(code).toBeLessThanOrEqual(4999);
    }
  });
});
