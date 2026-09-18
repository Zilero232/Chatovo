'use client';

import { clsx } from 'clsx';
import { Headphones, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { isNonNullish } from 'remeda';

import { UserAvatar, UserName } from '@/entities/auth/user';
import { buildDmHref, buildServerHref } from '@/shared/lib';
import { IconButtonWithTooltip } from '@/ui-kit';

import type { FriendRowProps } from './FriendRow.types';

import s from './FriendRow.module.scss';

export const FriendRow = ({ entry, room }: FriendRowProps) => {
  const router = useRouter();

  const t = useTranslations('channels.friends');
  const tLobby = useTranslations('lobby.tabs');

  const { user } = entry;
  const isInRoom = isNonNullish(room);

  return (
    <div className={s.root}>
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

      <span className={s.actions}>
        {isInRoom && (
          <IconButtonWithTooltip
            icon={<Headphones />}
            label={tLobby('joinVoice')}
            tooltipSide='top'
            type='button'
            onClick={() => router.push(buildServerHref(room.serverId, { channelId: room.id }))}
          />
        )}

        <IconButtonWithTooltip
          icon={<MessageSquare />}
          label={tLobby('message')}
          tooltipSide='top'
          type='button'
          onClick={() => router.push(buildDmHref(user.id))}
        />
      </span>
    </div>
  );
};
