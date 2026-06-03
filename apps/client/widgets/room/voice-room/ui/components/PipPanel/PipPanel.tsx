'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { HeadphoneOff, Headphones, LogOut, Mic, MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRoomParticipants } from '@/entities/room/room';
import { useRoomControls } from '@/features/room/room-control';
import { ParticipantCard } from '../ParticipantCard';
import { pipGridStyle, pipPanelStyles as s } from './PipPanel.styles';

export const PipPanel = () => {
  const t = useTranslations('room.pip');

  const room = useRoomContext();
  const participants = useParticipants();
  const { mic, deafen, leave } = useRoomControls();

  const presence = useRoomParticipants(room.name);
  const deafenedIds = new Set(presence.filter((p) => p.deafened).map((p) => p.identity));

  return (
    <div className={s.root}>
      <div className={s.grid} style={pipGridStyle}>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.identity}
            participant={participant}
            deafened={deafenedIds.has(participant.identity)}
          />
        ))}
      </div>

      <div className={s.controls}>
        <button
          aria-label={mic.isMuted ? t('unmute') : t('mute')}
          aria-pressed={mic.isMuted}
          className={s.button}
          data-tone={mic.isMuted ? 'danger' : 'default'}
          type="button"
          onClick={mic.toggle}
        >
          {mic.isMuted ? <MicOff /> : <Mic />}
        </button>

        <button
          aria-label={deafen.active ? t('undeafen') : t('deafen')}
          aria-pressed={deafen.active}
          className={s.button}
          data-tone={deafen.active ? 'danger' : 'default'}
          type="button"
          onClick={deafen.toggle}
        >
          {deafen.active ? <HeadphoneOff /> : <Headphones />}
        </button>

        <button
          aria-label={t('leave')}
          className={s.button}
          data-tone="leave"
          type="button"
          onClick={leave}
        >
          <LogOut />
        </button>
      </div>
    </div>
  );
};
