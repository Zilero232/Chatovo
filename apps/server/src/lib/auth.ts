import { supabaseAdmin } from './supabase';

export type UserRole = 'admin' | 'user';

type VerifiedUser = {
  userId: string;
  email?: string;
  role: UserRole;
};

export const readRole = (metadata: Record<string, unknown> | undefined): UserRole =>
  metadata?.role === 'admin' ? 'admin' : 'user';

export const verifyAccessToken = async (
  token: string | undefined,
): Promise<VerifiedUser | null> => {
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) return null;

  return {
    userId: data.user.id,
    email: data.user.email,
    role: readRole(data.user.app_metadata),
  };
};
