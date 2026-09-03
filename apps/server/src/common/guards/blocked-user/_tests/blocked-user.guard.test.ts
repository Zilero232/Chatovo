import type { ExecutionContext } from '@nestjs/common';

import { describe, expect, it, vi } from 'vitest';

const assertNotBlocked = vi.fn();

vi.mock('../../../../lib', () => ({
  assertNotBlocked: (userId: string) => assertNotBlocked(userId)
}));

const { BlockedUserGuard } = await import('../blocked-user.guard');

const contextFor = (session?: { user: { id: string } }): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ session }) })
  }) as unknown as ExecutionContext;

describe('BlockedUserGuard', () => {
  it('lets an anonymous request through without a block lookup', async () => {
    assertNotBlocked.mockClear();

    await expect(new BlockedUserGuard().canActivate(contextFor())).resolves.toBe(true);
    expect(assertNotBlocked).not.toHaveBeenCalled();
  });

  it('checks the signed-in user on every route, not just the gated ones', async () => {
    assertNotBlocked.mockClear().mockResolvedValueOnce(undefined);

    await expect(
      new BlockedUserGuard().canActivate(contextFor({ user: { id: 'user-1' } }))
    ).resolves.toBe(true);
    expect(assertNotBlocked).toHaveBeenCalledWith('user-1');
  });

  it('propagates the refusal so a blocked account cannot reach the handler', async () => {
    assertNotBlocked.mockClear().mockRejectedValueOnce(new Error('Account is blocked'));

    await expect(
      new BlockedUserGuard().canActivate(contextFor({ user: { id: 'user-1' } }))
    ).rejects.toThrow('Account is blocked');
  });
});
