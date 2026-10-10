import { beforeEach, describe, expect, it, vi } from 'vitest';

const findRoom = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: {
    room: { findUnique: (...args: unknown[]) => findRoom(...args) }
  }
}));

const { assertCanManageRoom } = await import('../assert-can-manage-room');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const OWNER = 'owner-1';

const room = (overrides: Record<string, unknown>) => ({
  kind: 'group',
  ownerId: OWNER,
  isPrivate: false,
  name: 'evening',
  ...overrides
});

describe('assertCanManageRoom', () => {
  beforeEach(() => {
    findRoom.mockReset();
  });

  it('lets the owner manage their group room', async () => {
    findRoom.mockResolvedValueOnce(room({}));

    await expect(assertCanManageRoom({ roomId: 'room-1', userId: OWNER })).resolves.toMatchObject({
      name: 'evening'
    });
  });

  it('refuses someone who does not own the room', async () => {
    findRoom.mockResolvedValueOnce(room({}));

    expect(await codeOf(assertCanManageRoom({ roomId: 'room-1', userId: 'stranger' }))).toBe(
      'FORBIDDEN'
    );
  });

  it('refuses to manage a dm room even for its creator, so it never reaches the public room list', async () => {
    findRoom.mockResolvedValueOnce(room({ kind: 'dm' }));

    expect(await codeOf(assertCanManageRoom({ roomId: 'dm-1', userId: OWNER }))).toBe('FORBIDDEN');
  });

  it('reports a missing room as not found', async () => {
    findRoom.mockResolvedValueOnce(null);

    expect(await codeOf(assertCanManageRoom({ roomId: 'gone', userId: OWNER }))).toBe(
      'ROOM_NOT_FOUND'
    );
  });
});
