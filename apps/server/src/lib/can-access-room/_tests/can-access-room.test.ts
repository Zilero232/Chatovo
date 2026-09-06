import { beforeEach, describe, expect, it, vi } from 'vitest';

const hasRoomGrant = vi.fn();

vi.mock('../../../modules/livekit', () => ({
  hasRoomGrant: (roomId: string, userId: string) => hasRoomGrant(roomId, userId)
}));

const { canAccessRoom } = await import('../can-access-room');

const userId = 'user-1';

const publicRoom = {
  id: 'room-public',
  kind: 'group',
  isPrivate: false,
  ownerId: 'owner-1',
  dmUserAId: null,
  dmUserBId: null
};

const privateRoom = { ...publicRoom, id: 'room-private', isPrivate: true };

const dmRoom = {
  id: 'room-dm',
  kind: 'dm',
  isPrivate: false,
  ownerId: null,
  dmUserAId: 'other-1',
  dmUserBId: 'other-2'
};

describe('canAccessRoom', () => {
  beforeEach(() => {
    hasRoomGrant.mockReset().mockReturnValue(false);
  });

  it('allows anyone into a public group room at either tier', () => {
    expect(canAccessRoom({ room: publicRoom, userId, tier: 'view' })).toBe(true);
    expect(canAccessRoom({ room: publicRoom, userId, tier: 'access' })).toBe(true);
  });

  it('refuses a dm to a non-member at either tier', () => {
    expect(canAccessRoom({ room: dmRoom, userId, tier: 'view' })).toBe(false);
    expect(canAccessRoom({ room: dmRoom, userId, tier: 'access' })).toBe(false);
  });

  it('allows either side of a dm', () => {
    expect(canAccessRoom({ room: { ...dmRoom, dmUserAId: userId }, userId, tier: 'access' })).toBe(
      true
    );
    expect(canAccessRoom({ room: { ...dmRoom, dmUserBId: userId }, userId, tier: 'access' })).toBe(
      true
    );
  });

  it('lets a stranger view a private room so the client can prompt for its password', () => {
    expect(canAccessRoom({ room: privateRoom, userId, tier: 'view' })).toBe(true);
    expect(hasRoomGrant).not.toHaveBeenCalled();
  });

  it('refuses a stranger without a grant access to a private room', () => {
    expect(canAccessRoom({ room: privateRoom, userId, tier: 'access' })).toBe(false);
    expect(hasRoomGrant).toHaveBeenCalledWith('room-private', userId);
  });

  it('allows the owner into a private room without consulting the grant store', () => {
    expect(canAccessRoom({ room: privateRoom, userId: 'owner-1', tier: 'access' })).toBe(true);
    expect(hasRoomGrant).not.toHaveBeenCalled();
  });

  it('allows a granted stranger into a private room', () => {
    hasRoomGrant.mockReturnValue(true);

    expect(canAccessRoom({ room: privateRoom, userId, tier: 'access' })).toBe(true);
  });

  it('checks dm membership before the private branch for a private dm', () => {
    const privateDm = { ...dmRoom, isPrivate: true, dmUserAId: userId };

    expect(canAccessRoom({ room: privateDm, userId, tier: 'access' })).toBe(true);
    expect(hasRoomGrant).not.toHaveBeenCalled();
  });
});
