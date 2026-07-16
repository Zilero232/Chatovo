'use client';

import { target, useEventListener } from '@siberiacancode/reactuse';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import s from '../../LobbyRooms.module.scss';

import type { LobbyRoomsSearchProps } from './LobbyRoomsSearch.types';

export const LobbyRoomsSearch = ({ query, onQueryChange }: LobbyRoomsSearchProps) => {
  const t = useTranslations('lobby');
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
      <h3 className={s.heading}>{t('roomsHeading')}</h3>

      <label className={s.searchField}>
        <Search className={s.searchIcon} />
        <input
          ref={searchRef}
          className={s.searchInput}
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <kbd className={s.searchShortcut}>⌘K</kbd>
      </label>
    </div>
  );
};
