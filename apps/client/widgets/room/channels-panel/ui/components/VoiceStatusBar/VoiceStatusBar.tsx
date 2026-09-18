'use client';

import { PhoneOff, Signal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';

import { useRoomSession } from '@/entities/room/session';
import { IconButtonWithTooltip } from '@/ui-kit';

import s from './VoiceStatusBar.module.scss';

export const VoiceStatusBar = () => {
  const t = useTranslations('channels.voiceStatus');

  const { session, close } = useRoomSession();

  if (isNullish(session) || session.isDm) {
    return null;
  }

  return (
    <div className={s.root}>
      <span aria-hidden className={s.icon}>
        <Signal />
      </span>

      <span className={s.text}>
        <span className={s.state}>{t('connected')}</span>
        <span className={s.room}>{session.roomName}</span>
      </span>

      <IconButtonWithTooltip
        className={s.leave}
        icon={<PhoneOff />}
        label={t('disconnect')}
        size='icon-sm'
        variant='ghost'
        onClick={() => close(session.roomId)}
      />
    </div>
  );
};
