'use client';

import { target, useEventListener } from '@siberiacancode/reactuse';
import { LayoutGrid, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import type { RoomsFilter } from '@/entities/room/room';

import { SearchField } from '@/shared/ui';

import type { LobbyRoomsView } from '../../LobbyRooms.types';
import type { LobbyRoomsSearchProps } from './LobbyRoomsSearch.types';

import s from '../../LobbyRooms.module.scss';

const FILTERS: RoomsFilter[] = ['all', 'live', 'mine'];

const VIEWS: { icon: typeof LayoutGrid; value: LobbyRoomsView }[] = [
  { icon: LayoutGrid, value: 'grid' },
  { icon: List, value: 'list' }
];

export const LobbyRoomsSearch = ({
  counts,
  filter,
  query,
  view,
  onFilterChange,
  onQueryChange,
  onViewChange
}: LobbyRoomsSearchProps) => {
  const t = useTranslations('lobby');
  const tFilters = useTranslations('lobby.filters');
  const tView = useTranslations('lobby.view');

  const searchRef = useRef<HTMLInputElement>(null);

  useEventListener(target(window), 'keydown', (event) => {
    if (event.key !== 'k' || !(event.metaKey || event.ctrlKey)) {
      return;
    }

    event.preventDefault();
    searchRef.current?.focus();
  });

  return (
    <div className={s.bar}>
      <div className={s.barLead}>
        <h3 className={s.heading}>{t('roomsHeading')}</h3>

        <div className={s.filters} role='group'>
          {FILTERS.map((value) => (
            <button
              key={value}
              aria-pressed={value === filter}
              className={s.filter}
              type='button'
              onClick={() => onFilterChange(value)}
            >
              {tFilters(value)}
              <span className={s.filterCount}>{counts[value]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={s.barTrail}>
        <SearchField
          className={s.searchField}
          inputRef={searchRef}
          placeholder={t('searchPlaceholder')}
          value={query}
          variant='glass'
          onValueChange={onQueryChange}
        />

        <div className={s.viewToggle} role='group'>
          {VIEWS.map(({ icon: Icon, value }) => (
            <button
              key={value}
              aria-label={tView(value)}
              aria-pressed={value === view}
              className={s.viewButton}
              title={tView(value)}
              type='button'
              onClick={() => onViewChange(value)}
            >
              <Icon aria-hidden className={s.viewIcon} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
