'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';

import { groupRooms, RoomsListError, useRooms, useRoomsPresence } from '@/entities/room/room';
import { Button, CenteredState } from '@/shared/ui';
import { RecentRooms } from '@/widgets/room/channels-panel';
import { LobbyEmpty } from '../LobbyEmpty';
import { LobbyRoomsSearch, LobbyRoomsSections, LobbyRoomsSkeleton } from './components';

import s from './LobbyRooms.module.scss';

export const LobbyRooms = () => {
  const t = useTranslations('lobby');

  const { rooms, isLoading, isEmpty, isError } = useRooms();
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');

  const sections = groupRooms(rooms, presence, query);

  return (
    <div className={s.root}>
      <RecentRooms variant="strip" />

      <LobbyRoomsSearch query={query} onQueryChange={setQuery} />

      {match({ isLoading, isError, isEmpty, nothingFound: isEmptyList(sections) })
        .with({ isLoading: true }, () => <LobbyRoomsSkeleton />)
        .with({ isError: true }, () => <RoomsListError />)
        .with({ isEmpty: true }, () => <LobbyEmpty />)
        .with({ nothingFound: true }, () => (
          <CenteredState
            action={
              <Button size="sm" type="button" variant="secondary" onClick={() => setQuery('')}>
                {t('clearSearch')}
              </Button>
            }
            className={s.nothingFoundState}
            description={t('nothingFound', { query })}
            icon={<Search className={s.searchStateIcon} />}
            size="sm"
            title={t('nothingFoundTitle')}
          />
        ))
        .otherwise(() => (
          <LobbyRoomsSections sections={sections} />
        ))}
    </div>
  );
};
