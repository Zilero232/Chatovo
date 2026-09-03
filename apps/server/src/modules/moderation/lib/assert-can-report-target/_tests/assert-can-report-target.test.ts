import { beforeEach, describe, expect, it, vi } from 'vitest';

const findUser = vi.fn();
const findMessage = vi.fn();
const findRoom = vi.fn();
const assertCanAccessRoom = vi.fn();

vi.mock('../../../../../core', () => ({
  basePrisma: {
    user: { findUnique: (...args: unknown[]) => findUser(...args) },
    message: { findUnique: (...args: unknown[]) => findMessage(...args) },
    room: { findUnique: (...args: unknown[]) => findRoom(...args) }
  }
}));

vi.mock('../../../../../lib', () => ({
  assertCanAccessRoom: (input: unknown) => assertCanAccessRoom(input)
}));

const { assertCanReportTarget } = await import('../assert-can-report-target');

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

const reporterId = 'reporter-1';

describe('assertCanReportTarget', () => {
  beforeEach(() => {
    findUser.mockReset();
    findMessage.mockReset();
    findRoom.mockReset();
    assertCanAccessRoom.mockReset().mockResolvedValue(undefined);
  });

  it('reports a user without tying the report to a room', async () => {
    findUser.mockResolvedValueOnce({ id: 'user-2' });

    await expect(
      assertCanReportTarget({ target: 'user', targetId: 'user-2', reporterId })
    ).resolves.toBeNull();
    expect(assertCanAccessRoom).not.toHaveBeenCalled();
  });

  it('rejects a user that does not exist', async () => {
    findUser.mockResolvedValueOnce(null);

    await expect(
      codeOf(assertCanReportTarget({ target: 'user', targetId: 'ghost', reporterId }))
    ).resolves.toBe('ABUSE_TARGET_NOT_FOUND');
  });

  it('takes the room from the message, not from the caller', async () => {
    findMessage.mockResolvedValueOnce({ roomId: 'room-9', senderId: 'someone-else' });

    await expect(
      assertCanReportTarget({ target: 'message', targetId: 'msg-1', reporterId })
    ).resolves.toBe('room-9');
    expect(assertCanAccessRoom).toHaveBeenCalledWith({ roomId: 'room-9', userId: reporterId });
  });

  it('refuses a message in a room the reporter cannot see', async () => {
    findMessage.mockResolvedValueOnce({ roomId: 'private-room', senderId: 'someone-else' });
    assertCanAccessRoom.mockRejectedValueOnce(new Error('Room access denied'));

    await expect(
      assertCanReportTarget({ target: 'message', targetId: 'msg-1', reporterId })
    ).rejects.toThrow('Room access denied');
  });

  it('refuses a report on the reporter own message', async () => {
    findMessage.mockResolvedValueOnce({ roomId: 'room-9', senderId: reporterId });

    await expect(
      codeOf(assertCanReportTarget({ target: 'message', targetId: 'msg-1', reporterId }))
    ).resolves.toBe('ABUSE_SELF_REPORT');
  });

  it('checks access before reporting a room', async () => {
    findRoom.mockResolvedValueOnce({ id: 'room-3' });

    await expect(
      assertCanReportTarget({ target: 'room', targetId: 'room-3', reporterId })
    ).resolves.toBe('room-3');
    expect(assertCanAccessRoom).toHaveBeenCalledWith({ roomId: 'room-3', userId: reporterId });
  });

  it('hides an existing message behind the same error as a missing one', async () => {
    findMessage.mockResolvedValueOnce(null);

    await expect(
      codeOf(assertCanReportTarget({ target: 'message', targetId: 'msg-x', reporterId }))
    ).resolves.toBe('ABUSE_TARGET_NOT_FOUND');
  });
});
