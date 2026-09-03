'use client';

import { useParticipants, useRoomContext } from '@livekit/components-react';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomParticipants } from '@/entities/room/room';
import { Text } from '@/ui-kit';

import type { ParticipantsViewProps } from './ParticipantsView.types';

import { ROSTER_EVENTS } from '../../../config';
import { InvisibleParticipantCard } from '../InvisibleParticipantCard/InvisibleParticipantCard';
import { ParticipantCard } from '../ParticipantCard/ParticipantCard';
import { EmptyRoomScene } from './EmptyRoomScene';

import s from './ParticipantsView.module.scss';

export const ParticipantsView = ({ isDm = false }: ParticipantsViewProps) => {
  const t = useTranslations('room');
  const room = useRoomContext();
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();

  const isSelfInvisible = isAdmin && settings.system.invisibleMode;

  const presence = useRoomParticipants(room.name);
  const deafenedIds = new Set(presence.filter((p) => p.deafened).map((p) => p.identity));
  const invisibleParticipants = presence.filter(
    (p) => p.invisible && !participants.some((live) => live.identity === p.identity)
  );

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
                invisible={isSelfInvisible}
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
      {participants.length <= 1 && invisibleParticipants.length === 0 && <EmptyRoomScene />}

      <div className={s.grid}>
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.identity}
            deafened={deafenedIds.has(participant.identity)}
            invisible={isSelfInvisible && participant.isLocal}
            participant={participant}
          />
        ))}

        {invisibleParticipants.map((participant) => (
          <InvisibleParticipantCard key={participant.identity} participant={participant} />
        ))}
      </div>
    </div>
  );
};
