import { auth } from '../../auth';

/**
 * Ends every session of a user through better-auth rather than deleting the rows.
 * A raw `session.deleteMany` would leave a cached session valid until its TTL expires
 * if session caching is ever enabled.
 */
export const revokeUserSessions = async (userId: string): Promise<void> => {
  const context = await auth.$context;

  await context.internalAdapter.deleteUserSessions(userId);
};
