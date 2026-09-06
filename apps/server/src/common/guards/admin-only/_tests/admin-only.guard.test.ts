import type { ExecutionContext } from '@nestjs/common';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const assertIsAdmin = vi.fn();

vi.mock('../../../../lib', () => ({
  assertIsAdmin: (userId: string) => assertIsAdmin(userId)
}));

const { AdminOnlyGuard } = await import('../admin-only.guard');

const contextFor = (session?: { user: { id: string } }): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ session }) })
  }) as unknown as ExecutionContext;

const codeOf = async (call: Promise<unknown>): Promise<string> => {
  try {
    await call;
  } catch (error) {
    return (error as { getResponse: () => { code: string } }).getResponse().code;
  }

  throw new Error('expected the call to throw');
};

describe('AdminOnlyGuard', () => {
  beforeEach(() => {
    assertIsAdmin.mockReset().mockResolvedValue(undefined);
  });

  it('checks the signed-in user', async () => {
    await expect(
      new AdminOnlyGuard().canActivate(contextFor({ user: { id: 'user-1' } }))
    ).resolves.toBe(true);
    expect(assertIsAdmin).toHaveBeenCalledWith('user-1');
  });

  it('refuses a request with no session instead of skipping the check', async () => {
    await expect(codeOf(new AdminOnlyGuard().canActivate(contextFor()))).resolves.toBe(
      'ADMIN_ONLY'
    );
    expect(assertIsAdmin).not.toHaveBeenCalled();
  });

  it('propagates the refusal so a non-admin cannot reach the handler', async () => {
    assertIsAdmin.mockRejectedValueOnce(new Error('Admin only'));

    await expect(
      new AdminOnlyGuard().canActivate(contextFor({ user: { id: 'user-1' } }))
    ).rejects.toThrow('Admin only');
  });

  it('runs the admin lookup once per request, not once per service call', async () => {
    const guard = new AdminOnlyGuard();

    await guard.canActivate(contextFor({ user: { id: 'user-1' } }));

    expect(assertIsAdmin).toHaveBeenCalledTimes(1);
  });
});
