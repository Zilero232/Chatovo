import { PERMISSIONS } from '@chatovo/schemas';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const findRooms = vi.fn();
const resolveServerChannelPermissions = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: {
    room: { findMany: (...args: unknown[]) => findRooms(...args) }
  }
}));

vi.mock('../../resolve-member-permissions', () => ({
  resolveServerChannelPermissions: (...args: unknown[]) => resolveServerChannelPermissions(...args)
}));

const { filterAccessibleRooms } = await import('../filter-accessible-rooms');

const userId = 'user-1';

const room = (overrides: Record<string, unknown>) => ({
  id: 'room-public',
  kind: 'group',
  ownerId: 'owner-1',
  serverId: null,
  dmUserAId: null,
  dmUserBId: null,
  ...overrides
});

describe('filterAccessibleRooms', () => {
  beforeEach(() => {
    findRooms.mockReset();
    resolveServerChannelPermissions.mockReset();
  });

  it('skips the query entirely for an empty list', async () => {
    await expect(filterAccessibleRooms({ roomIds: [], userId })).resolves.toEqual([]);
    expect(findRooms).not.toHaveBeenCalled();
  });

  it('keeps only the rooms the user may enter', async () => {
    findRooms.mockResolvedValueOnce([
      room({ id: 'public' }),
      room({ id: 'dm-mine', kind: 'dm', dmUserAId: userId, dmUserBId: 'other' }),
      room({ id: 'dm-theirs', kind: 'dm', dmUserAId: 'a', dmUserBId: 'b' })
    ]);

    await expect(
      filterAccessibleRooms({
        roomIds: ['public', 'dm-mine', 'dm-theirs'],
        userId
      })
    ).resolves.toEqual(['public', 'dm-mine']);
  });

  it('drops ids that no longer resolve to a room', async () => {
    findRooms.mockResolvedValueOnce([]);

    await expect(filterAccessibleRooms({ roomIds: ['gone'], userId })).resolves.toEqual([]);
  });

  it('keeps a server channel only when readMessageHistory is granted', async () => {
    findRooms.mockResolvedValueOnce([
      room({ id: 'readable', serverId: 'server-1' }),
      room({ id: 'hidden', serverId: 'server-1' })
    ]);
    resolveServerChannelPermissions.mockResolvedValueOnce({
      channelPermissions: new Map([
        ['readable', PERMISSIONS.readMessageHistory],
        ['hidden', PERMISSIONS.viewChannel]
      ])
    });

    await expect(
      filterAccessibleRooms({ roomIds: ['readable', 'hidden'], userId })
    ).resolves.toEqual(['readable']);
  });

  it('refuses a channel of a server the user does not belong to', async () => {
    findRooms.mockResolvedValueOnce([room({ id: 'private', serverId: 'server-2' })]);
    resolveServerChannelPermissions.mockResolvedValueOnce({ channelPermissions: new Map() });

    await expect(filterAccessibleRooms({ roomIds: ['private'], userId })).resolves.toEqual([]);
  });
});
