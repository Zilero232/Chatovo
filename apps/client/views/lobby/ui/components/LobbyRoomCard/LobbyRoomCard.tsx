'use client';

import { clsx } from 'clsx';
import { Lock, Radio } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useCurrentUser } from '@/entities/auth/user';
import { OwnerBadge, useRoomParticipants } from '@/entities/room/room';
import { ManageRoomMenu } from '@/features/room/manage';
import { buildRoomHref } from '@/shared/constants';
import { Badge } from '@/shared/ui';
import { RoomCardEmptySlots, RoomCardParticipants } from './components';

import s from './LobbyRoomCard.module.scss';

import type { LobbyRoomCardProps } from './LobbyRoomCard.types';

export const LobbyRoomCard = ({ room }: LobbyRoomCardProps) => {
  const t = useTranslations('lobby.card');

  const router = useRouter();

  const { user } = useCurrentUser();
  const participants = useRoomParticipants(room.id);

  const isLive = participants.length > 0;
  const isOwner = user?.id === room.ownerId;

  return (
    <div className={clsx(s.root, 'glass', 'glass-hover')} data-live={isLive}>
      {isLive && (
        <>
          <span aria-hidden className={s.liveGlow} />
          <span aria-hidden className={s.liveAccent} />
          <Radio aria-hidden className={s.watermark} />
        </>
      )}

      <button className={s.enter} type="button" onClick={() => router.push(buildRoomHref(room.id))}>
        <div className={s.header}>
          <span className={s.name}>
            {room.name}
            {room.isPrivate && <Lock className={s.privateIcon} />}
          </span>

          <div className={s.headerBadges}>
            {isOwner && <OwnerBadge />}
            {isLive ? (
              <Badge tone="primary">
                <span className={s.liveDot} />
                {t('live')}
              </Badge>
            ) : (
              <Badge tone="muted">{t('empty')}</Badge>
            )}
          </div>
        </div>

        <div className={s.body}>
          {isLive ? (
            <RoomCardParticipants ownerId={room.ownerId} participants={participants} />
          ) : (
            <RoomCardEmptySlots />
          )}
        </div>
      </button>

      <ManageRoomMenu className={s.menu} room={room} />
    </div>
  );
};
