'use client';

import { Clock, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { filter, indexBy, isEmpty, isNonNullish, map } from 'remeda';
import { useRecentRooms, useRooms, useRoomsPresence } from '@/entities/room/room';
import { buildRoomHref } from '@/shared/constants';
import { recentRoomsStyles as s } from './RecentRooms.styles';
import type { RecentRoomsProps } from './RecentRooms.types';

export const RecentRooms = ({ onNavigate, variant = 'list' }: RecentRoomsProps = {}) => {
  const t = useTranslations('lobby.recent');
  const router = useRouter();

  const { recent } = useRecentRooms();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();

  const roomsById = indexBy(rooms, (room) => room.id);
  const entries = filter(
    map(recent, (entry) => roomsById[entry.id]),
    isNonNullish,
  );

  if (isEmpty(entries)) {
    return null;
  }

  const isStrip = variant === 'strip';

  const navigate = (roomId: string) => {
    router.push(buildRoomHref(roomId));
    onNavigate?.();
  };

  return (
    <div className={isStrip ? s.rootStrip : s.root}>
      <h4 className={isStrip ? s.headingStrip : s.heading}>
        <Clock className={s.headingIcon} />
        {t('heading')}
      </h4>

      <div className={isStrip ? s.strip : s.list}>
        {entries.map((room) => {
          const live = (presence[room.id]?.length ?? 0) > 0;

          return (
            <button
              key={room.id}
              className={isStrip ? s.stripItem : s.item}
              data-live={live}
              type="button"
              onClick={() => navigate(room.id)}
            >
              <span className={live ? s.dotLive : s.dot} />
              <span className={isStrip ? s.stripName : s.name}>{room.name}</span>
              {room.isPrivate && <Lock className={s.lockIcon} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
