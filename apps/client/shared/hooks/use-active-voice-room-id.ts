'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants';

export const useActiveVoiceRoomId = (): string | null => {
  const pathname = usePathname();
  const params = useSearchParams();

  if (pathname !== ROUTES.room) {
    return null;
  }

  return params.get('id');
};
