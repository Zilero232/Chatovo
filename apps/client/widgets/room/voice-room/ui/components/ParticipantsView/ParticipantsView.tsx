'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { useRoomParticipants } from '@/entities/room/room';
import { Text } from '@/shared/ui';

import type { ParticipantsViewProps } from './ParticipantsView.types';

import { ROSTER_EVENTS } from '../../../config';
import { ParticipantCard } from '../ParticipantCard/ParticipantCard';
import { EmptyRoomScene } from './EmptyRoomScene';

import s from './ParticipantsView.module.scss';

export const ParticipantsView = ({ isDm = false }: ParticipantsViewProps) => {
  const t = useTranslations('room');
  const room = useRoomContext();
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  const presence = useRoomParticipants(room.name);
  const deafenedIds = new Set(presence.filter((p) => p.deafened).map((p) => p.identity));

  if (isDm) {
    const localParticipant = participants.find((p) => p.isLocal);
    const peer = participants.find((p) => !p.isLocal);

    return (
      <div className={clsx(s.root, s.rootDm)}>
        <div className={s.dmStage}>
          {peer ? (
            <div className={s.dmPeer}>
              <ParticipantCard fill deafened={deafenedIds.has(peer.identity)} participant={peer} />
            </div>
          ) : (
            <Text className={s.dmWaiting} tone='muted'>
              {t('dmWaiting')}
            </Text>
          )}

          {localParticipant && (
            <div className={s.dmSelf}>
              <ParticipantCard
                fill
                deafened={deafenedIds.has(localParticipant.identity)}
                participant={localParticipant}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={s.root}>
      {participants.length <= 1 && <EmptyRoomScene />}

      <div className={s.grid}>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.identity}
            deafened={deafenedIds.has(participant.identity)}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
};
