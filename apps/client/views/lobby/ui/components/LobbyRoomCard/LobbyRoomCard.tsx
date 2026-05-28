'use client';

import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UserAvatar, useCurrentUser } from '@/entities/auth/user';
import { OwnerBadge, OwnerCrown, useRoomParticipants } from '@/entities/room/room';
import { ManageRoomMenu } from '@/features/room/manage';
import { buildRoomHref } from '@/shared/constants';
import { lobbyRoomCardStyles as s } from './LobbyRoomCard.styles';
import type { LobbyRoomCardProps } from './LobbyRoomCard.types';

// How many participant avatars to render before collapsing into a "+N" chip.
const MAX_AVATARS = 4;

export const LobbyRoomCard = ({ room }: LobbyRoomCardProps) => {
  const t = useTranslations('lobby.card');

  const router = useRouter();

  const { user } = useCurrentUser();

  const participants = useRoomParticipants(room.id);

  const isLive = participants.length > 0;
  const shown = participants.slice(0, MAX_AVATARS);
  const overflow = participants.length - shown.length;
  const isOwner = user?.id === room.ownerId;

  return (
    <div className={s.root}>
      <button className={s.enter} type="button" onClick={() => router.push(buildRoomHref(room.id))}>
        <div className={s.header}>
          <span className={s.name}>
            {room.name}
            {room.isPrivate && <Lock className={s.privateIcon} />}
          </span>

          <div className={s.headerBadges}>
            {isOwner && <OwnerBadge />}
            {isLive ? (
              <span className={s.liveBadge}>
                <span className={s.liveDot} />
                {t('live')}
              </span>
            ) : (
              <span className={s.idleBadge}>{t('empty')}</span>
            )}
          </div>
        </div>

        {isLive ? (
          <div className={s.participants}>
            <div className={s.avatars}>
              {shown.map((participant) => (
                <div key={participant.identity} className={s.avatarWrapper}>
                  {participant.identity === room.ownerId && <OwnerCrown />}
                  <UserAvatar
                    name={participant.name}
                    src={participant.avatarUrl}
                    className={s.avatar}
                    fallbackClassName={s.avatarFallback}
                  />
                </div>
              ))}
              {overflow > 0 && <span className={s.overflow}>+{overflow}</span>}
            </div>
            <span className={s.countLabel}>{t('people', { count: participants.length })}</span>
          </div>
        ) : (
          <span className={s.emptyHint}>{t('emptyHint')}</span>
        )}
      </button>

      <ManageRoomMenu className={s.menu} room={room} />
    </div>
  );
};
