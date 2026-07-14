'use client';

import { AudioLines } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CreateRoomDialog } from '@/features/room/create';
import { Button, CenteredState } from '@/shared/ui';
import s from './LobbyEmpty.module.scss';

export const LobbyEmpty = () => {
  const t = useTranslations('lobby.empty');
  const tCreate = useTranslations('createRoom');

  return (
    <CenteredState
      icon={<AudioLines className={s.icon} />}
      title={t('title')}
      description={t('text')}
      action={
        <CreateRoomDialog
          trigger={
            <Button type="button" variant="secondary">
              {tCreate('trigger')}
            </Button>
          }
        />
      }
    />
  );
};
