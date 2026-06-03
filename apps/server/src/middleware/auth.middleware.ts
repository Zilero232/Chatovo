import { StatusCodes } from 'http-status-codes';
import { auth } from '../modules/auth';
import type { MiddlewareHandler } from 'hono';
import type { UserRole } from '../modules/auth';

export type AuthVars = {
  email?: string;
  userId: string;
  role: UserRole;
};

export const authMiddleware: MiddlewareHandler<{ Variables: AuthVars }> = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: 'Unauthorized' }, StatusCodes.UNAUTHORIZED);
  }

  c.set('userId', session.user.id);
  c.set('email', session.user.email);
  c.set('role', session.user.role === 'admin' ? 'admin' : 'user');

  await next();
};
