'use client';

import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useLastChannel } from '@/entities/server/channel';
import { buildServerHref, getAvatarColor, getInitials } from '@/shared/lib';
import { Text } from '@/ui-kit';

import type { LobbyServerCardProps } from './LobbyServerCard.types';

import s from './LobbyServerCard.module.scss';

export const LobbyServerCard = ({ server }: LobbyServerCardProps) => {
  const router = useRouter();

  const t = useTranslations('server.join');

  const { lastChannelId } = useLastChannel(server.id);

  const open = () =>
    router.push(
      buildServerHref(server.id, {
        channelId: lastChannelId ?? server.systemChannelId ?? undefined
      })
    );

  return (
    <button className={s.root} type='button' onClick={open}>
      <span
        style={
          server.iconUrl
            ? undefined
            : { background: server.bannerColor ?? getAvatarColor(server.name) }
        }
        className={s.icon}
      >
        {server.iconUrl ? (
          <img alt='' className={s.image} src={server.iconUrl} />
        ) : (
          getInitials(server.name)
        )}
      </span>

      <span className={s.info}>
        <span className={s.name}>{server.name}</span>
        {server.description && (
          <Text className={s.description} size='xs' tone='muted'>
            {server.description}
          </Text>
        )}
        <span className={s.members}>
          <Users aria-hidden className={s.membersIcon} />
          {t('members', { count: server.memberCount })}
        </span>
      </span>
    </button>
  );
};
