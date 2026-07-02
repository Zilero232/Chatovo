'use client';

import { useQueryClient } from '@tanstack/react-query';
import { WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { QUERY_KEYS } from '@/shared/constants';
import { Button, CenteredState } from '@/shared/ui';

export const RoomsListError = () => {
  const t = useTranslations('lobby.roomsError');
  const queryClient = useQueryClient();

  const retry = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms() });
  };

  return (
    <CenteredState
      action={
        <Button size="sm" type="button" variant="secondary" onClick={retry}>
          {t('retry')}
        </Button>
      }
      description={t('description')}
      icon={<WifiOff className="size-5" />}
      size="sm"
      title={t('title')}
    />
  );
};
