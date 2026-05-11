'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/entities/user';

const Home = () => {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return;
    router.replace(session ? '/lobby' : '/auth');
  }, [isLoading, session, router]);

  return null;
};

export default Home;
