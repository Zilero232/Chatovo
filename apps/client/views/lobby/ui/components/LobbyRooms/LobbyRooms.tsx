'use client';

import { target, useEventListener } from '@siberiacancode/reactuse';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';
import { groupRooms, RoomsListError, useRooms, useRoomsPresence } from '@/entities/room/room';
import { Button, CenteredState, Skeleton } from '@/shared/ui';
import { RecentRooms } from '@/widgets/room/channels-panel';
import { LobbyEmpty } from '../LobbyEmpty';
import { LobbyRoomCard } from '../LobbyRoomCard';
import s from './LobbyRooms.module.scss';

const LOBBY_SKELETON_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

const LobbyRoomsSkeleton = () => (
  <div className={s.grid}>
    {LOBBY_SKELETON_KEYS.map((key) => (
      <Skeleton key={key} className={s.skeletonCard} />
    ))}
  </div>
);

export const LobbyRooms = () => {
  const t = useTranslations('lobby');
  const tSections = useTranslations('room.sections');

  const { rooms, isLoading, isEmpty, isError } = useRooms();
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEventListener(target(window), 'keydown', (event) => {
    if (event.key !== 'k' || !(event.metaKey || event.ctrlKey)) {
      return;
    }

    event.preventDefault();
    searchRef.current?.focus();
  });

  const sections = groupRooms(rooms, presence, query);

  return (
    <div className={s.root}>
      <RecentRooms variant="strip" />

      <div className={s.bar}>
        <h3 className={s.heading}>{t('roomsHeading')}</h3>

        <label className={s.searchField}>
          <Search className={s.searchIcon} />
          <input
            ref={searchRef}
            className={s.searchInput}
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd className={s.searchShortcut}>⌘K</kbd>
        </label>
      </div>

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
          <div className={s.sections}>
            {sections.map((section, sectionIndex) => (
              <section
                key={section.key}
                className={s.section}
                style={{ animationDelay: `${sectionIndex * 90}ms` }}
              >
                <div className={s.sectionHeader}>
                  <h4 className={s.sectionLabel}>{tSections(section.key)}</h4>
                  <span className={s.sectionCount}>{section.rooms.length}</span>
                  <span aria-hidden className={s.sectionRule} />
                </div>

                <div className={s.grid}>
                  {section.rooms.map((room, roomIndex) => (
                    <div
                      key={room.id}
                      className={s.cardAnim}
                      style={{ animationDelay: `${Math.min(roomIndex, 10) * 40}ms` }}
                    >
                      <LobbyRoomCard room={room} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ))}
    </div>
  );
};
