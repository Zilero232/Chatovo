'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { clsx } from 'clsx';
import { RoomEvent } from 'livekit-client';
import { useTranslations } from 'next-intl';

import { useRoomParticipants } from '@/entities/room/room';
import { Text } from '@/shared/ui';
import { InviteParticipantCard } from '../InviteParticipantCard';
import { ParticipantCard } from '../ParticipantCard';

import s from './ParticipantsView.module.scss';

import type { ParticipantsViewProps } from './ParticipantsView.types';

const ROSTER_EVENTS = [
  RoomEvent.ParticipantConnected,
  RoomEvent.ParticipantDisconnected,
  RoomEvent.ConnectionStateChanged,
];

export const ParticipantsView = ({ roomId, isDm = false }: ParticipantsViewProps) => {
  const t = useTranslations('room');
  const room = useRoomContext();
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  const presence = useRoomParticipants(room.name);
  const deafenedIds = new Set(presence.filter((p) => p.deafened).map((p) => p.identity));

  const isSolo = participants.length === 1;
  const showInviteSlot = isSolo && !isDm;

  if (isDm) {
    const localParticipant = participants.find((p) => p.isLocal);
    const peer = participants.find((p) => !p.isLocal);

    return (
      <div className={clsx(s.root, s.rootDm)}>
        <div className={s.dmStage}>
          {peer ? (
            <div className={s.dmPeer}>
              <ParticipantCard participant={peer} deafened={deafenedIds.has(peer.identity)} fill />
            </div>
          ) : (
            <Text className={s.dmWaiting} tone="muted">
              {t('dmWaiting')}
            </Text>
          )}

          {localParticipant && (
            <div className={s.dmSelf}>
              <ParticipantCard
                participant={localParticipant}
                deafened={deafenedIds.has(localParticipant.identity)}
                fill
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <div className={s.grid}>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.identity}
            participant={participant}
            deafened={deafenedIds.has(participant.identity)}
          />
        ))}
        {showInviteSlot && <InviteParticipantCard roomId={roomId} />}
      </div>
    </div>
  );
};
