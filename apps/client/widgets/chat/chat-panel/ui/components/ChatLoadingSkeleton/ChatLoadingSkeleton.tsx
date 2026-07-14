import { Skeleton } from '@/shared/ui';
import s from './ChatLoadingSkeleton.module.scss';

const CHAT_SKELETON_KEYS = ['a', 'b', 'c', 'd', 'e', 'f'] as const;

export const ChatLoadingSkeleton = () => (
  <div className={s.list}>
    {CHAT_SKELETON_KEYS.map((key) => (
      <div key={key} className={s.row}>
        <Skeleton className={s.avatar} />
        <div className={s.body}>
          <Skeleton className={s.lineShort} />
          <Skeleton className={s.lineLong} />
        </div>
      </div>
    ))}
  </div>
);
