import { useQuery } from '@tanstack/react-query';
import { isNonNullish, isString } from 'remeda';
import { supabase } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import type { User } from '@supabase/supabase-js';
import type { UserRole } from './types';

const readRole = (user: User | null): UserRole =>
  user?.app_metadata?.role === 'admin' ? 'admin' : 'user';

// Verification is set manually under app_metadata.verified — admin-only.
const readVerified = (user: User | null): boolean => user?.app_metadata?.verified === true;

// profile_url lives in user_metadata; the user edits it in settings. A blank
// or non-string value resolves to null so callers can treat it as "no link".
const readProfileUrl = (user: User | null): string | null => {
  const value = user?.user_metadata?.profile_url;

  return isString(value) && value.trim().length > 0 ? value.trim() : null;
};

// display_name is set at email sign-up; Google sign-in stores the name under
// full_name/name instead. Fall back to the email local part as a last resort.
const resolveDisplayName = (user: User | null): string => {
  const metadata = user?.user_metadata ?? {};

  const nameFromMetadata = [metadata.display_name, metadata.full_name, metadata.name]
    .filter(isString)
    .map((value) => value.trim())
    .find((value) => value.length > 0);

  return nameFromMetadata ?? user?.email?.split('@')[0] ?? 'you';
};

// OAuth providers store the avatar URL under avatar_url; some use picture.
// Returns null when neither is a usable string, so callers fall back to initials.
const readAvatarUrl = (user: User | null): string | null => {
  const metadata = user?.user_metadata ?? {};

  const url = [metadata.avatar_url, metadata.picture]
    .filter(isString)
    .map((value) => value.trim())
    .find((value) => value.length > 0);

  return url ?? null;
};

export const useCurrentUser = () => {
  const { data: session, isLoading } = useQuery({
    queryKey: QUERY_KEYS.session(),
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();

      return data.session;
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const user = session?.user ?? null;
  const role = readRole(user);

  const displayName = resolveDisplayName(user);
  const initial = displayName.charAt(0).toUpperCase();

  return {
    user,
    role,
    session: session ?? null,
    isLoading,
    displayName,
    initial,
    isAdmin: role === 'admin',
    avatarUrl: readAvatarUrl(user),
    verified: readVerified(user),
    profileUrl: readProfileUrl(user),
    isAuthenticated: isNonNullish(user),
  };
};
