'use client';

import { clsx } from 'clsx';
import { Headphones } from 'lucide-react';
import { isNonNullish } from 'remeda';

import { UserAvatar } from '@/entities/auth/user';
import { useFriendChat } from '@/features/social/friend-chat';

import type { DirectMessageItemProps } from './DirectMessageItem.types';

import s from './DirectMessageItem.module.scss';

export const DirectMessageItem = ({ room, user, onNavigate }: DirectMessageItemProps) => {
  const { open } = useFriendChat();

  const isInRoom = isNonNullish(room);

  return (
    <button
      className={s.root}
      type='button'
      onClick={() => {
        open(user);
        onNavigate?.();
      }}
    >
      <span className={s.avatarSlot}>
        <UserAvatar className={s.avatar} name={user.name} src={user.avatarUrl} />
        <span
          aria-hidden
          className={clsx(s.presenceDot, {
            [s.presenceDotInRoom]: isInRoom,
            [s.presenceDotOnline]: user.isOnline && !isInRoom
          })}
        />
      </span>

      <span className={s.name}>{user.name}</span>

      {isInRoom && <Headphones aria-hidden className={s.voiceIcon} />}
    </button>
  );
};
