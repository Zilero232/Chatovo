import { Skeleton } from '@/shared/ui';

import s from './ProfileCardSkeleton.module.scss';

export const ProfileCardSkeleton = () => {
  return (
    <div className={s.root}>
      <Skeleton className={s.banner} />
      <div className={s.body}>
        <Skeleton className={s.avatar} />
        <Skeleton className={s.lineShort} />
        <Skeleton className={s.lineLong} />
        <Skeleton className={s.block} />
      </div>
    </div>
  );
};
