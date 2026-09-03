import { beforeEach, describe, expect, it } from 'vitest';

import {
  grantRoomAccess,
  hasRoomGrant,
  revokeRoomGrants,
  revokeUserGrants
} from '../room-grant-store';

describe('revokeUserGrants', () => {
  beforeEach(() => {
    revokeRoomGrants('room-a');
    revokeRoomGrants('room-b');
  });

  it('drops the grants a user holds across every room', () => {
    grantRoomAccess('room-a', 'user-1');
    grantRoomAccess('room-b', 'user-1');

    revokeUserGrants('user-1');

    expect(hasRoomGrant('room-a', 'user-1')).toBe(false);
    expect(hasRoomGrant('room-b', 'user-1')).toBe(false);
  });

  it('leaves other users in the same room untouched', () => {
    grantRoomAccess('room-a', 'user-1');
    grantRoomAccess('room-a', 'user-2');

    revokeUserGrants('user-1');

    expect(hasRoomGrant('room-a', 'user-2')).toBe(true);
  });

  it('does not match a user whose id merely ends with the revoked one', () => {
    grantRoomAccess('room-a', 'admin-user-1');

    revokeUserGrants('user-1');

    expect(hasRoomGrant('room-a', 'admin-user-1')).toBe(true);
  });
});
