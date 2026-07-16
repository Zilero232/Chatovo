'use client';

import dynamic from 'next/dynamic';

const AuthBackground = dynamic(
  () => import('@/shared/ui').then((m) => ({ default: m.AuthBackground })),
  { ssr: false },
);

export const LandingBackground = () => <AuthBackground />;
