import { beforeAll, describe, expect, it } from 'vitest';

import { hashRoomPassword } from '../../../../../lib';
import { grantRoomAccess } from '../../../room-grant-store';
import { assertRoomAccess } from '../assert-room-access';

const OWNER = 'owner-1';
const STRANGER = 'stranger-1';

let privateRoom: Parameters<typeof assertRoomAccess>[0]['room'];

beforeAll(async () => {
  privateRoom = {
    id: 'room-private',
    kind: 'group',
    isPrivate: true,
    ownerId: OWNER,
    dmUserAId: null,
    dmUserBId: null,
    password: await hashRoomPassword('secret')
  };
});

describe('assertRoomAccess', () => {
  it('lets the owner into their private room without a password', async () => {
    await expect(assertRoomAccess({ room: privateRoom, userId: OWNER })).resolves.toBeUndefined();
  });

  it('lets back in a user who already entered the password', async () => {
    grantRoomAccess('room-private', 'returning-1');

    await expect(
      assertRoomAccess({ room: privateRoom, userId: 'returning-1' })
    ).resolves.toBeUndefined();
  });

  it('asks a stranger for the password', async () => {
    await expect(assertRoomAccess({ room: privateRoom, userId: STRANGER })).rejects.toMatchObject({
      response: { code: 'ROOM_PASSWORD_REQUIRED' }
    });
  });

  it('refuses a stranger with a wrong password', async () => {
    await expect(
      assertRoomAccess({ room: privateRoom, userId: STRANGER, password: 'nope' })
    ).rejects.toMatchObject({ response: { code: 'ROOM_PASSWORD_INVALID' } });
  });

  it('lets a stranger in with the right password', async () => {
    await expect(
      assertRoomAccess({ room: privateRoom, userId: STRANGER, password: 'secret' })
    ).resolves.toBeUndefined();
  });

  it('lets anyone into a public room', async () => {
    await expect(
      assertRoomAccess({ room: { ...privateRoom, isPrivate: false }, userId: STRANGER })
    ).resolves.toBeUndefined();
  });
});
