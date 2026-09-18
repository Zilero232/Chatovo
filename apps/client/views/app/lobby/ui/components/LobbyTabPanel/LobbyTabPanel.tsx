'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isEmpty } from 'remeda';
import { match } from 'ts-pattern';

import { useRoomsPresence } from '@/entities/room/room';
import { useVoiceChannels } from '@/entities/server/channel';
import { useFriends } from '@/entities/social/friend';
import { CenteredState, ScrollArea, SearchField, Skeleton, Text } from '@/ui-kit';
import { groupFriendsByPresence } from '@/widgets/room/channels-panel';

import type { LobbyTabPanelProps } from './LobbyTabPanel.types';

import { FriendRow } from '../FriendRow/FriendRow';

import s from './LobbyTabPanel.module.scss';

const SKELETON_KEYS = ['a', 'b', 'c', 'd'] as const;

export const LobbyTabPanel = ({ tab }: LobbyTabPanelProps) => {
  const t = useTranslations('lobby.tabs');

  const { data: friends, isPending } = useFriends();
  const { channels } = useVoiceChannels();
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');

  const { online, offline, roomByUserId } = groupFriendsByPresence({
    friends: friends ?? [],
    presence,
    channels
  });

  const needle = query.trim().toLowerCase();
  const source = tab === 'online' ? online : [...online, ...offline];
  const visible = source.filter((entry) => entry.user.name.toLowerCase().includes(needle));

  return (
    <div className={s.root}>
      <div className={s.search}>
        <SearchField placeholder={t('search')} value={query} onValueChange={setQuery} />
      </div>

      <ScrollArea className={s.scroll}>
        {match({ isPending, isEmpty: isEmpty(visible) })
          .with({ isPending: true }, () => (
            <div className={s.list}>
              {SKELETON_KEYS.map((key) => (
                <Skeleton key={key} className={s.skeleton} />
              ))}
            </div>
          ))
          .with({ isEmpty: true }, () => (
            <CenteredState pattern='waves' size='sm' title={t('empty')} />
          ))
          .otherwise(() => (
            <div className={s.list}>
              <Text className={s.count} size='xs' tone='muted'>
                {t(tab === 'online' ? 'onlineCount' : 'allCount', { count: visible.length })}
              </Text>

              {visible.map((entry) => (
                <FriendRow
                  key={entry.friendshipId}
                  entry={entry}
                  room={roomByUserId.get(entry.user.id) ?? null}
                />
              ))}
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};
