import { Skeleton } from '@/shared/ui';

import s from '../../LobbyRooms.module.scss';

const LOBBY_SKELETON_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export const LobbyRoomsSkeleton = () => (
  <div className={s.grid}>
    {LOBBY_SKELETON_KEYS.map((key) => (
      <Skeleton key={key} className={s.skeletonCard} />
    ))}
  </div>
);
