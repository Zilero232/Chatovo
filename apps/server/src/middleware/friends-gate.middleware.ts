import { authMiddleware } from './auth.middleware';
import type { MiddlewareHandler } from 'hono';

export const friendsAuthMiddleware: MiddlewareHandler = (c, next) => {
  return authMiddleware(c, next);
};
