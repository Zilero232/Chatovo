import { auth } from '../../../auth/auth';

export type AuthorizedRealtimeUser = {
  isAdmin: boolean;
  userId: string;
};

export const authorizeToken = async (
  token: string | null
): Promise<AuthorizedRealtimeUser | null> => {
  if (!token) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${token}` })
  });

  if (!session) {
    return null;
  }

  return { userId: session.user.id, isAdmin: session.user.role === 'admin' };
};
