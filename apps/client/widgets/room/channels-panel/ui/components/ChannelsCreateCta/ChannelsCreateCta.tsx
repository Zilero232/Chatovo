'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CreateRoomDialog } from '@/features/room/create';
import { IconButtonWithTooltip } from '@/ui-kit';

import s from './ChannelsCreateCta.module.scss';

export const ChannelsCreateCta = () => {
  const t = useTranslations('channels');

  return (
    <CreateRoomDialog
      trigger={
        <IconButtonWithTooltip
          className={s.cta}
          icon={<Plus className={s.icon} />}
          label={t('createRoom')}
          size='sm'
          type='button'
          variant='secondary'
        />
      }
    />
  );
};
