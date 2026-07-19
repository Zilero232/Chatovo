'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { Text } from '@/shared/ui';
import { AUTH_EQ_BARS, AUTH_ROOM_SPEAKERS } from '../../../config';

import s from './AuthRoomPreview.module.scss';

const LIVE_COUNT = AUTH_ROOM_SPEAKERS.length;

export const AuthRoomPreview = () => {
  const t = useTranslations('auth');

  return (
    <div aria-hidden className={clsx(s.root, 'glass')}>
      <div className={s.header}>
        <span className={s.liveDot} />
        <Text size="xs" tone="muted" weight="medium">
          {t('liveNow')}
        </Text>
        <Text className={s.roomName} size="xs" weight="semibold">
          {t('roomDemoName')}
        </Text>
      </div>

      <div className={s.speakers}>
        {AUTH_ROOM_SPEAKERS.map((speaker) => (
          <span key={speaker.id} className={clsx(s.speaker, speaker.isSpeaking && s.speakerActive)}>
            {speaker.initial}
          </span>
        ))}
        <span className={s.speakerMore}>+{LIVE_COUNT * 3}</span>
      </div>

      <div className={s.wave}>
        {AUTH_EQ_BARS.map((bar) => (
          <span
            key={bar.id}
            className={s.waveBar}
            style={{ height: bar.height, animationDelay: bar.delay }}
          />
        ))}
      </div>
    </div>
  );
};
