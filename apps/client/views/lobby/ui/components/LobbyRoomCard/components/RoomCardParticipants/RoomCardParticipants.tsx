'use client';

import { useTranslations } from 'next-intl';

import { UserAvatar } from '@/entities/auth/user';
import { OwnerCrown } from '@/entities/room/room';
import { AvatarWithBadges, Badge } from '@/shared/ui';

import type { RoomCardParticipantsProps } from './RoomCardParticipants.types';

import { RoomCapacityArc } from '../RoomCapacityArc';

import s from '../../LobbyRoomCard.module.scss';

const MAX_AVATARS = 4;
const ARC_THRESHOLD = 6;
const REFERENCE_CAPACITY = 12;

export const RoomCardParticipants = ({ ownerId, participants }: RoomCardParticipantsProps) => {
  const t = useTranslations('lobby.card');

  const { length: total } = participants;
  const isCrowded = total >= ARC_THRESHOLD;

  const shown = participants.slice(0, isCrowded ? MAX_AVATARS - 1 : MAX_AVATARS);
  const overflow = total - shown.length;

  return (
    <div className={s.participants}>
      <div className={s.avatars}>
        {shown.map((participant) => (
          <span key={participant.identity} className={s.avatarCell}>
            <AvatarWithBadges topLeft={participant.identity === ownerId && <OwnerCrown />}>
              <UserAvatar
                className={s.avatar}
                fallbackClassName={s.avatarFallback}
                name={participant.name}
                src={participant.avatarUrl}
              />
            </AvatarWithBadges>
            <span className={s.avatarName}>{participant.name}</span>
          </span>
        ))}
        {isCrowded ? (
          <RoomCapacityArc capacity={REFERENCE_CAPACITY} count={total} />
        ) : (
          overflow > 0 && (
            <Badge size='sm' tone='muted'>
              +{overflow}
            </Badge>
          )
        )}
      </div>
      <span className={s.countLabel}>{t('people', { count: total })}</span>
    </div>
  );
};
