import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/entities/user';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { isLoading, session } = useAuthStore.getState();
    if (isLoading) return;
    throw redirect({ to: session ? '/lobby' : '/auth' });
  },
});
