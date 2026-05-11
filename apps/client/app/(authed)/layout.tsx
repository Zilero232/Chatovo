'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

import { useAuthStore } from '@/entities/user';

const AuthedLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (!session) router.replace('/auth');
  }, [session, router]);

  if (!session) return null;
  return <>{children}</>;
};

export default AuthedLayout;
