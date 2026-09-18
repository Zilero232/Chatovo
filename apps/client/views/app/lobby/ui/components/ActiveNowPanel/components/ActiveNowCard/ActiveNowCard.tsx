'use client';

import { Headphones } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { UserAvatar } from '@/entities/auth/user';
import { buildServerHref } from '@/shared/lib';
import { Button, Text } from '@/ui-kit';

import type { ActiveNowCardProps } from './ActiveNowCard.types';

import s from './ActiveNowCard.module.scss';

export const ActiveNowCard = ({ group }: ActiveNowCardProps) => {
  const router = useRouter();

  const t = useTranslations('channels.activity');

  const others = group.totalInRoom - group.friends.length;

  return (
    <div className={s.root}>
      <Text truncate className={s.channel} size='xs' tone='muted'>
        {`${group.serverName} · ${group.roomName}`}
      </Text>

      <div className={s.people}>
        {group.friends.map((friend) => (
          <span key={friend.friendshipId} className={s.person}>
            <UserAvatar className={s.avatar} name={friend.user.name} src={friend.user.avatarUrl} />
            <span className={s.personName}>{friend.user.name}</span>
          </span>
        ))}
        {others > 0 && (
          <Text size='xs' tone='muted'>
            {t('others', { count: others })}
          </Text>
        )}
      </div>

      <Button
        className={s.join}
        size='sm'
        type='button'
        variant='secondary'
        onClick={() => router.push(buildServerHref(group.serverId, { channelId: group.roomId }))}
      >
        <Headphones />
        {t('join')}
      </Button>
    </div>
  );
};
