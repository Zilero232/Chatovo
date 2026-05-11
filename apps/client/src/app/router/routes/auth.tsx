import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/entities/user';
import { AuthPage } from '@/pages/auth';

export const Route = createFileRoute('/auth')({
  beforeLoad: () => {
    const { session } = useAuthStore.getState();
    if (session) throw redirect({ to: '/lobby' });
  },
  component: AuthPage,
});
