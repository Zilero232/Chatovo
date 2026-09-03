import { describe, expect, it } from 'vitest';

import { hashRoomPassword, isHashedRoomPassword, verifyRoomPassword } from '../room-password';

describe('room password hashing', () => {
  it('never stores the password in readable form', async () => {
    const hash = await hashRoomPassword('hunter2');

    expect(hash).not.toContain('hunter2');
    expect(isHashedRoomPassword(hash)).toBe(true);
  });

  it('accepts the correct password and rejects a wrong one', async () => {
    const hash = await hashRoomPassword('hunter2');

    expect(await verifyRoomPassword('hunter2', hash)).toBe(true);
    expect(await verifyRoomPassword('hunter3', hash)).toBe(false);
  });

  it('still verifies legacy plaintext rows written before hashing', async () => {
    expect(await verifyRoomPassword('legacy', 'legacy')).toBe(true);
    expect(await verifyRoomPassword('wrong', 'legacy')).toBe(false);
  });
});
