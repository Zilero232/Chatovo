import { useAuthStore } from './auth-store';

export const useCurrentUser = () => {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  return {
    user,
    role,
    session,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
  };
};
