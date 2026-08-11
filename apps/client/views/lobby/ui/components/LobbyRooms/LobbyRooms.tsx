'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';

import type { RoomsFilter } from '@/entities/room/room';

import { useCurrentUser } from '@/entities/auth/user';
import {
  countRoomsByFilter,
  groupRooms,
  RoomsListError,
  useRooms,
  useRoomsPresence
} from '@/entities/room/room';
import { STORAGE_KEYS } from '@/shared/constants';
import { Button, CenteredState } from '@/shared/ui';
import { RecentRooms } from '@/widgets/room/channels-panel';

import type { LobbyRoomsView } from './LobbyRooms.types';

import { LobbyEmpty } from '../LobbyEmpty/LobbyEmpty';
import { LobbyRoomsSearch, LobbyRoomsSections, LobbyRoomsSkeleton } from './components';

import s from './LobbyRooms.module.scss';

export const LobbyRooms = () => {
  const t = useTranslations('lobby');

  const { rooms, isLoading, isEmpty, isError } = useRooms();
  const presence = useRoomsPresence();
  const { user } = useCurrentUser();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RoomsFilter>('all');
  const { value: storedView, set: setView } = useLocalStorage<LobbyRoomsView>(
    STORAGE_KEYS.lobbyRoomsView,
    'grid'
  );

  const view = storedView ?? 'grid';

  const counts = countRoomsByFilter(rooms, presence, user?.id);
  const sections = groupRooms(rooms, presence, query, filter, user?.id);

  return (
    <div className={s.root}>
      <RecentRooms variant='strip' />

      <LobbyRoomsSearch
        counts={counts}
        filter={filter}
        query={query}
        view={view}
        onFilterChange={setFilter}
        onQueryChange={setQuery}
        onViewChange={setView}
      />

      {match({ isLoading, isError, isEmpty, nothingFound: isEmptyList(sections) })
        .with({ isLoading: true }, () => <LobbyRoomsSkeleton />)
        .with({ isError: true }, () => <RoomsListError />)
        .with({ isEmpty: true }, () => <LobbyEmpty />)
        .with({ nothingFound: true }, () => (
          <CenteredState
            action={
              <Button
                size='sm'
                type='button'
                variant='secondary'
                onClick={() => {
                  setQuery('');
                  setFilter('all');
                }}
              >
                {t('clearSearch')}
              </Button>
            }
            className={s.nothingFoundState}
            description={t('nothingFound', { query })}
            icon={<Search className={s.searchStateIcon} />}
            size='sm'
            title={t('nothingFoundTitle')}
          />
        ))
        .otherwise(() => (
          <LobbyRoomsSections sections={sections} view={view} />
        ))}
    </div>
  );
};
