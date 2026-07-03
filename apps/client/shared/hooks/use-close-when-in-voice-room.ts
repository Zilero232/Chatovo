'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useEffectEvent } from 'react';
import { ROUTES } from '@/shared/constants';

export const useCloseWhenInVoiceRoom = (close: () => void) => {
  const pathname = usePathname();
  const isVoiceRoom = pathname === ROUTES.room;
  const onClose = useEffectEvent(close);

  useEffect(() => {
    if (isVoiceRoom) {
      onClose();
    }
  }, [isVoiceRoom]);
};
