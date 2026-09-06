import { beforeEach, describe, expect, it, vi } from 'vitest';

const findRoom = vi.fn();
const assertNotBlocked = vi.fn();
const hasRoomGrant = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: {
    room: { findUnique: (...args: unknown[]) => findRoom(...args) }
  }
}));

vi.mock('../../assert-not-blocked', () => ({
  assertNotBlocked: (userId: string) => assertNotBlocked(userId)
}));

vi.mock('../../../modules/livekit', () => ({
  hasRoomGrant: (roomId: string, userId: string) => hasRoomGrant(roomId, userId)
}));

const { assertCanAccessRoom } = await import('../assert-can-access-room');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const userId = 'user-1';

const publicRoom = {
  id: 'room-1',
  kind: 'group',
  isPrivate: false,
  ownerId: 'owner-1',
  dmUserAId: null,
  dmUserBId: null
};

describe('assertCanAccessRoom', () => {
  beforeEach(() => {
    findRoom.mockReset();
    assertNotBlocked.mockReset().mockResolvedValue(undefined);
    hasRoomGrant.mockReset().mockReturnValue(false);
  });

  it('lets anyone into a public room', async () => {
    findRoom.mockResolvedValueOnce(publicRoom);

    await expect(assertCanAccessRoom({ roomId: 'room-1', userId })).resolves.toBeUndefined();
  });

  it('rejects a dm the user is not part of', async () => {
    findRoom.mockResolvedValueOnce({
      ...publicRoom,
      kind: 'dm',
      dmUserAId: 'other-1',
      dmUserBId: 'other-2'
    });

    await expect(codeOf(assertCanAccessRoom({ roomId: 'room-1', userId }))).resolves.toBe(
      'FORBIDDEN'
    );
  });

  it('allows a dm member', async () => {
    findRoom.mockResolvedValueOnce({ ...publicRoom, kind: 'dm', dmUserAId: userId });

    await expect(assertCanAccessRoom({ roomId: 'room-1', userId })).resolves.toBeUndefined();
  });

  it('refuses a private room to a stranger without a grant', async () => {
    findRoom.mockResolvedValueOnce({ ...publicRoom, isPrivate: true });

    await expect(codeOf(assertCanAccessRoom({ roomId: 'room-1', userId }))).resolves.toBe(
      'ROOM_ACCESS_DENIED'
    );
  });

  it('allows the owner of a private room', async () => {
    findRoom.mockResolvedValueOnce({ ...publicRoom, isPrivate: true, ownerId: userId });

    await expect(assertCanAccessRoom({ roomId: 'room-1', userId })).resolves.toBeUndefined();
  });

  it('allows a stranger holding a live grant into a private room', async () => {
    findRoom.mockResolvedValueOnce({ ...publicRoom, isPrivate: true });
    hasRoomGrant.mockReturnValue(true);

    await expect(assertCanAccessRoom({ roomId: 'room-1', userId })).resolves.toBeUndefined();
  });

  it('reports a missing room as not found', async () => {
    findRoom.mockResolvedValueOnce(null);

    await expect(codeOf(assertCanAccessRoom({ roomId: 'gone', userId }))).resolves.toBe(
      'ROOM_NOT_FOUND'
    );
  });

  it('checks the block list before reading the room', async () => {
    assertNotBlocked.mockRejectedValueOnce(new Error('blocked'));

    await expect(assertCanAccessRoom({ roomId: 'room-1', userId })).rejects.toThrow('blocked');
    expect(findRoom).not.toHaveBeenCalled();
  });
});
