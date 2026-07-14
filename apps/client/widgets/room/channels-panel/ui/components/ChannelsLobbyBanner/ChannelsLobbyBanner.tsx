'use client';

import { clsx } from 'clsx';
import { AudioLines, Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CreateRoomDialog } from '@/features/room/create';
import { Button } from '@/shared/ui';
import { RecentRooms } from '../RecentRooms';
import s from './ChannelsLobbyBanner.module.scss';

export const ChannelsLobbyBanner = () => {
  const t = useTranslations('channels.banner');

  return (
    <div className={s.root}>
      <div className={clsx(s.card, 'glass')}>
        <span aria-hidden className={s.cardGlow} />
        <span aria-hidden className={s.cardWash} />
        <div className={s.iconBox}>
          <AudioLines className={s.icon} />
        </div>

        <div className={s.text}>
          <p className={s.title}>{t('title')}</p>
          <p className={s.hint}>{t('hint')}</p>
        </div>

        <CreateRoomDialog
          trigger={
            <Button className={s.cta} type="button">
              {t('createRoom')}
            </Button>
          }
        />
      </div>

      <RecentRooms />

      <div className={s.tip}>
        <Lightbulb className={s.tipIcon} />
        <span>{t('tip')}</span>
      </div>
    </div>
  );
};
