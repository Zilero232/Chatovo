import { describe, expect, it } from 'vitest';

import { canAccessRoom } from '../can-access-room';

const userId = 'user-1';

const groupRoom = {
  id: 'room-public',
  kind: 'group',
  dmUserAId: null,
  dmUserBId: null
};

const dmRoom = {
  id: 'room-dm',
  kind: 'dm',
  dmUserAId: 'other-1',
  dmUserBId: 'other-2'
};

describe('canAccessRoom', () => {
  it('allows anyone into a standalone group room', () => {
    expect(canAccessRoom({ room: groupRoom, userId })).toBe(true);
  });

  it('refuses a dm to a non-member', () => {
    expect(canAccessRoom({ room: dmRoom, userId })).toBe(false);
  });

  it('allows either side of a dm', () => {
    expect(canAccessRoom({ room: { ...dmRoom, dmUserAId: userId }, userId })).toBe(true);
    expect(canAccessRoom({ room: { ...dmRoom, dmUserBId: userId }, userId })).toBe(true);
  });
});
