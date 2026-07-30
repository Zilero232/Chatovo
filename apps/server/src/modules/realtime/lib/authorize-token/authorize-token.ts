import { auth } from '../../../auth/auth';

export const authorizeToken = async (token: string | null): Promise<string | null> => {
  if (!token) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${token}` })
  });

  return session?.user.id ?? null;
};
