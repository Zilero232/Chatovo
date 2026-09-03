import { beforeEach, describe, expect, it, vi } from 'vitest';

const hasUserConnection = vi.fn();

vi.mock('../../realtime', () => ({
  hasUserConnection: (userId: string) => hasUserConnection(userId)
}));

const { toAbuseReport, toAdminRoom, toAdminUser } = await import('../mappers');

const report = {
  id: 'report-1',
  target: 'user' as const,
  targetId: 'user-2',
  reason: 'harassment' as const,
  comment: 'was rude in voice',
  roomId: 'room-1',
  reporterId: 'user-1',
  handled: false,
  handledAt: null,
  handledById: null,
  createdAt: new Date('2026-09-03T10:00:00.000Z')
};

const user = {
  id: 'user-2',
  name: 'Spammer',
  email: 'spam@example.com',
  friendTag: 'spam#1',
  role: 'user',
  verified: false,
  emailVerified: true,
  blockedAt: new Date('2026-09-03T11:00:00.000Z'),
  blockedReason: 'repeated spam',
  blockedById: 'admin-1',
  createdAt: new Date('2026-01-05T09:00:00.000Z'),
  profile: { displayName: 'Spammy', avatarUrl: null, bio: 'hi', profileUrl: null },
  _count: { rooms: 3, messages: 42 }
};

const room = {
  id: 'room-1',
  name: 'General',
  kind: 'group',
  isPrivate: false,
  password: null,
  ownerId: 'user-1',
  owner: { name: 'Owner' },
  createdAt: new Date('2026-02-01T08:00:00.000Z'),
  _count: { messages: 128 }
};

describe('toAbuseReport', () => {
  it('serialises createdAt to an ISO string', () => {
    expect(toAbuseReport(report as never).createdAt).toBe('2026-09-03T10:00:00.000Z');
  });

  it('keeps a null comment null rather than undefined', () => {
    expect(toAbuseReport({ ...report, comment: null } as never).comment).toBeNull();
  });

  it('leaves the enriched fields empty for the caller to fill in', () => {
    const mapped = toAbuseReport(report as never);

    expect(mapped.reporter).toBeNull();
    expect(mapped.reportedUser).toBeNull();
    expect(mapped.roomName).toBeNull();
  });

  it('never leaks the moderator who handled the report', () => {
    expect(toAbuseReport(report as never)).not.toHaveProperty('handledById');
  });
});

describe('toAdminUser', () => {
  beforeEach(() => {
    hasUserConnection.mockReset().mockReturnValue(false);
  });

  it('prefers the profile display name over the account name', () => {
    expect(toAdminUser(user as never).displayName).toBe('Spammy');
  });

  it('reads presence from the connection store, not the database', () => {
    hasUserConnection.mockReturnValueOnce(true);

    expect(toAdminUser(user as never).online).toBe(true);
    expect(hasUserConnection).toHaveBeenCalledWith('user-2');
  });

  it('serialises the block timestamp and keeps the reason', () => {
    const mapped = toAdminUser(user as never);

    expect(mapped.blockedAt).toBe('2026-09-03T11:00:00.000Z');
    expect(mapped.blockedReason).toBe('repeated spam');
  });

  it('never leaks the moderator who applied the block', () => {
    expect(toAdminUser(user as never)).not.toHaveProperty('blockedById');
  });

  it('carries the aggregate counts through', () => {
    const mapped = toAdminUser(user as never);

    expect(mapped.roomsCount).toBe(3);
    expect(mapped.messagesCount).toBe(42);
  });

  it('maps a profile-less account without throwing', () => {
    const mapped = toAdminUser({ ...user, profile: null } as never);

    expect(mapped.displayName).toBeNull();
    expect(mapped.bio).toBeNull();
  });
});

describe('toAdminRoom', () => {
  it('reports whether a password is set without exposing it', () => {
    const mapped = toAdminRoom({ room: { ...room, password: 'secret' } as never, participants: 0 });

    expect(mapped.hasPassword).toBe(true);
    expect(mapped).not.toHaveProperty('password');
  });

  it('marks a room with no password', () => {
    expect(toAdminRoom({ room: room as never, participants: 0 }).hasPassword).toBe(false);
  });

  it('takes the live participant count from the caller', () => {
    expect(toAdminRoom({ room: room as never, participants: 7 }).participants).toBe(7);
  });

  it('falls back to the owner id when the relation is missing', () => {
    expect(
      toAdminRoom({ room: { ...room, owner: null } as never, participants: 0 }).ownerName
    ).toBeNull();
  });
});
