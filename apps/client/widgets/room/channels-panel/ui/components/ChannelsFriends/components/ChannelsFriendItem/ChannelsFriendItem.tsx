'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { isNonNullish } from 'remeda';

import { UserAvatar, UserName } from '@/entities/auth/user';
import { buildRoomHref } from '@/shared/constants';

import type { ChannelsFriendItemProps } from './ChannelsFriendItem.types';

import s from './ChannelsFriendItem.module.scss';

export const ChannelsFriendItem = ({ room, user, onNavigate }: ChannelsFriendItemProps) => {
  const t = useTranslations('channels.friends');
  const router = useRouter();

  const isInRoom = isNonNullish(room);

  const handleClick = () => {
    if (!isInRoom) {
      return;
    }

    router.push(buildRoomHref(room.id));
    onNavigate?.();
  };

  return (
    <button
      className={clsx(s.root, { [s.rootJoinable]: isInRoom })}
      disabled={!isInRoom}
      type='button'
      onClick={handleClick}
    >
      <span className={s.avatarSlot}>
        <UserAvatar
          className={s.avatar}
          fallbackClassName={s.avatarFallback}
          name={user.name}
          src={user.avatarUrl}
        />
        <span
          aria-hidden
          className={clsx(s.presenceDot, {
            [s.presenceDotInRoom]: isInRoom,
            [s.presenceDotOnline]: user.isOnline && !isInRoom
          })}
        />
      </span>

      <span className={s.info}>
        <UserName
          className={s.name}
          developer={user.developer}
          name={user.name}
          verified={user.verified}
        />
        <span className={clsx(s.status, { [s.statusInRoom]: isInRoom })}>
          {isInRoom ? room.name : t(user.isOnline ? 'statusOnline' : 'statusOffline')}
        </span>
      </span>
    </button>
  );
};
