'use client';

import { useTranslations } from 'next-intl';

import { UserAvatar } from '@/entities/auth/user';
import { OwnerCrown } from '@/entities/room/room';
import { AvatarWithBadges, Badge } from '@/shared/ui';

import s from '../../LobbyRoomCard.module.scss';

import type { RoomCardParticipantsProps } from './RoomCardParticipants.types';

const MAX_AVATARS = 4;

export const RoomCardParticipants = ({ ownerId, participants }: RoomCardParticipantsProps) => {
  const t = useTranslations('lobby.card');

  const shown = participants.slice(0, MAX_AVATARS);
  const overflow = participants.length - shown.length;

  return (
    <div className={s.participants}>
      <div className={s.avatars}>
        {shown.map((participant) => (
          <AvatarWithBadges
            key={participant.identity}
            topLeft={participant.identity === ownerId && <OwnerCrown />}
          >
            <UserAvatar
              name={participant.name}
              src={participant.avatarUrl}
              className={s.avatar}
              fallbackClassName={s.avatarFallback}
            />
          </AvatarWithBadges>
        ))}
        {overflow > 0 && (
          <Badge size="sm" tone="muted">
            +{overflow}
          </Badge>
        )}
      </div>
      <span className={s.countLabel}>{t('people', { count: participants.length })}</span>
    </div>
  );
};
