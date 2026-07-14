'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

import { useRoomParticipants } from '@/entities/room/room';
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
  const room = useRoomContext();
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  const presence = useRoomParticipants(room.name);
  const deafenedIds = new Set(presence.filter((p) => p.deafened).map((p) => p.identity));

  const isSolo = participants.length === 1;
  const showInviteSlot = isSolo && !isDm;

  return (
    <div className={s.root}>
      <div className={s.grid}>
        {participants.map((participant, index) => (
          <ParticipantCard
            key={participant.identity}
            participant={participant}
            deafened={deafenedIds.has(participant.identity)}
            index={index}
          />
        ))}
        {showInviteSlot && <InviteParticipantCard roomId={roomId} />}
      </div>
    </div>
  );
};
