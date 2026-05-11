import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/entities/user';

export const Route = createFileRoute('/_authed')({
  beforeLoad: () => {
    const { session } = useAuthStore.getState();
    if (!session) throw redirect({ to: '/auth' });
  },
  component: Outlet,
});
