import type { RoomParticipant } from '@chatovo/schemas';

import { beforeEach, describe, expect, it } from 'vitest';

import { addParticipant, clearRoom, getAdminSnapshot, getSnapshot } from '../presence-store';

const participant = (identity: string, invisible = false): RoomParticipant => ({
  identity,
  name: identity,
  micMuted: true,
  deafened: false,
  invisible,
  verified: false,
  developer: false,
  profileUrl: null,
  avatarUrl: null,
  bannerColor: null
});

describe('presence snapshots', () => {
  beforeEach(() => {
    clearRoom('room-a');
  });

  it('keeps invisible participants out of the public snapshot', () => {
    addParticipant('room-a', participant('user-1'));
    addParticipant('room-a', participant('ghost-admin', true));

    expect(getSnapshot().rooms['room-a']?.map((p) => p.identity)).toEqual(['user-1']);
  });

  it('exposes invisible participants to the admin snapshot', () => {
    addParticipant('room-a', participant('user-1'));
    addParticipant('room-a', participant('ghost-admin', true));

    expect(getAdminSnapshot().rooms['room-a']?.map((p) => p.identity)).toEqual([
      'user-1',
      'ghost-admin'
    ]);
  });

  it('omits a room from the public snapshot when only invisible admins remain', () => {
    addParticipant('room-a', participant('ghost-admin', true));

    expect(getSnapshot().rooms['room-a']).toBeUndefined();
    expect(getAdminSnapshot().rooms['room-a']).toHaveLength(1);
  });
});
