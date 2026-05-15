import { useAuthStore } from './auth-store';

export const useCurrentUser = () => {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  const displayName = user?.email?.split('@')[0] ?? 'you';
  const initial = displayName.charAt(0).toUpperCase();

  return {
    user,
    role,
    session,
    isLoading,
    displayName,
    initial,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
  };
};
