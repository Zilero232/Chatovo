import { beforeEach, describe, expect, it, vi } from 'vitest';

const findRoom = vi.fn();
const findUser = vi.fn();
const assertNotBlocked = vi.fn();
const assertRoomAccess = vi.fn();
const hasRoomGrant = vi.fn();
const grantRoomAccess = vi.fn();

vi.mock('../../../../../lib', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  assertNotBlocked: (userId: string) => assertNotBlocked(userId)
}));

vi.mock('../../../lib', () => ({
  assertRoomAccess: (input: unknown) => assertRoomAccess(input),
  resolveInvisible: ({ requested, isAdmin }: { requested?: boolean; isAdmin: boolean }) =>
    Boolean(requested) && isAdmin
}));

vi.mock('../../../room-grant-store', () => ({
  grantRoomAccess: (roomId: string, userId: string) => grantRoomAccess(roomId, userId)
}));

vi.mock('../../../../livekit', () => ({
  hasRoomGrant: (roomId: string, userId: string) => hasRoomGrant(roomId, userId)
}));

vi.mock('../../../../users', () => ({
  toUserProfile: () => ({
    name: 'Tester',
    verified: false,
    developer: false,
    profileUrl: null,
    avatarUrl: null,
    bannerColor: null
  })
}));

const { LivekitService } = await import('../livekit.service');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const userId = 'user-1';

const prisma = {
  user: { findUnique: (...args: unknown[]) => findUser(...args) },
  room: { findUnique: (...args: unknown[]) => findRoom(...args) }
};

const config = { get: (key: string) => (key === 'LIVEKIT_API_KEY' ? 'devkey' : 'x'.repeat(32)) };

const serviceUnderTest = () => new LivekitService(prisma as never, config as never);

const room = (overrides: Record<string, unknown>) => ({
  id: 'room-1',
  kind: 'group',
  isPrivate: false,
  password: null,
  ownerId: 'owner-1',
  dmUserAId: null,
  dmUserBId: null,
  ...overrides
});

describe('LivekitService.issueRoomToken', () => {
  beforeEach(() => {
    findRoom.mockReset();
    findUser.mockReset().mockResolvedValue({ id: userId, role: 'user', profile: null });
    assertNotBlocked.mockReset().mockResolvedValue(undefined);
    assertRoomAccess.mockReset().mockResolvedValue(undefined);
    hasRoomGrant.mockReset().mockReturnValue(false);
    grantRoomAccess.mockReset();
  });

  it('issues a token for a public room and records the grant', async () => {
    findRoom.mockResolvedValueOnce(room({}));

    const result = await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId,
      isAdmin: false
    });

    expect(result.token).toEqual(expect.any(String));
    expect(grantRoomAccess).toHaveBeenCalledWith('room-1', userId);
  });

  it('refuses a dm the user is not part of', async () => {
    findRoom.mockResolvedValueOnce(room({ kind: 'dm', dmUserAId: 'a', dmUserBId: 'b' }));

    await expect(
      codeOf(serviceUnderTest().issueRoomToken({ roomId: 'room-1', userId, isAdmin: false }))
    ).resolves.toBe('FORBIDDEN');
    expect(grantRoomAccess).not.toHaveBeenCalled();
  });

  it('lets a dm member in', async () => {
    findRoom.mockResolvedValueOnce(room({ kind: 'dm', dmUserAId: userId, dmUserBId: 'b' }));

    await expect(
      serviceUnderTest().issueRoomToken({ roomId: 'room-1', userId, isAdmin: false })
    ).resolves.toEqual({
      token: expect.any(String)
    });
  });

  it('lets a stranger reach the password check of a private room', async () => {
    findRoom.mockResolvedValueOnce(room({ isPrivate: true, password: 'hashed' }));

    await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId,
      password: 'secret',
      isAdmin: false
    });

    expect(assertRoomAccess).toHaveBeenCalledWith({
      room: expect.objectContaining({ isPrivate: true }),
      password: 'secret'
    });
  });

  it('reports a missing room as not found', async () => {
    findRoom.mockResolvedValueOnce(null);

    await expect(
      codeOf(serviceUnderTest().issueRoomToken({ roomId: 'gone', userId, isAdmin: false }))
    ).resolves.toBe('ROOM_NOT_FOUND');
  });

  it('skips the password check for an invisible admin', async () => {
    findUser.mockResolvedValueOnce({ id: userId, role: 'admin', profile: null });
    findRoom.mockResolvedValueOnce(room({ isPrivate: true, password: 'hashed' }));

    await serviceUnderTest().issueRoomToken({
      roomId: 'room-1',
      userId,
      invisible: true,
      isAdmin: false
    });

    expect(assertRoomAccess).not.toHaveBeenCalled();
  });

  it('refuses a blocked account before any lookup', async () => {
    assertNotBlocked.mockRejectedValueOnce(new Error('blocked'));

    await expect(
      serviceUnderTest().issueRoomToken({ roomId: 'room-1', userId, isAdmin: false })
    ).rejects.toThrow('blocked');
    expect(findRoom).not.toHaveBeenCalled();
  });
});
