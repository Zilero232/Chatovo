'use client';

import { DoorClosed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/shared/constants';
import { Button, CenteredState } from '@/shared/ui';

export const RoomNotFound = () => {
  const t = useTranslations('room');
  const router = useRouter();

  return (
    <CenteredState
      icon={<DoorClosed className="size-6" />}
      title={t('notFound')}
      action={<Button onClick={() => router.replace(ROUTES.lobby)}>{t('backToLobby')}</Button>}
    />
  );
};
