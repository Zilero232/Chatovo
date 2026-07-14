'use client';

import { clsx } from 'clsx';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';
import { groupRooms, RoomsListError, useRooms, useRoomsPresence } from '@/entities/room/room';
import { CenteredState, ScrollArea, Skeleton } from '@/shared/ui';
import { ChannelsRoomItem } from '../ChannelsRoomItem';
import s from './ChannelsList.module.scss';

const CHANNELS_SKELETON_KEYS = ['a', 'b', 'c', 'd', 'e'] as const;

const SectionLabel = ({ children, offset = false }: { children: ReactNode; offset?: boolean }) => (
  <p className={clsx(s.sectionLabel, offset && s.sectionLabelOffset)}>{children}</p>
);

const ChannelsListSkeleton = () => (
  <div className={s.skeletonList}>
    {CHANNELS_SKELETON_KEYS.map((key) => (
      <Skeleton key={key} className={s.skeletonItem} />
    ))}
  </div>
);

type ChannelsListProps = {
  onNavigate?: () => void;
};

export const ChannelsList = ({ onNavigate }: ChannelsListProps = {}) => {
  const t = useTranslations('channels');
  const tSections = useTranslations('room.sections');

  const { rooms, isLoading, isEmpty, isError } = useRooms();
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');

  const sections = groupRooms(rooms, presence, query);

  return (
    <>
      <div className={s.search}>
        <label className={s.searchField}>
          <Search className={s.searchIcon} />
          <input
            className={s.searchInput}
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {match({ isLoading, isError, isEmpty, nothingFound: isEmptyList(sections) })
            .with({ isLoading: true }, () => <ChannelsListSkeleton />)
            .with({ isError: true }, () => (
              <div className={s.emptyState}>
                <RoomsListError />
              </div>
            ))
            .with({ isEmpty: true }, () => (
              <CenteredState
                className={s.emptyState}
                description={t('banner.hint')}
                size="sm"
                title={t('noRoomsYet')}
              />
            ))
            .with({ nothingFound: true }, () => (
              <CenteredState className={s.emptyState} size="sm" title={t('nothingFound')} />
            ))
            .otherwise(() =>
              sections.map((section, index) => (
                <div key={section.key}>
                  <SectionLabel offset={index > 0}>{tSections(section.key)}</SectionLabel>

                  {section.rooms.map((room, roomIndex) => (
                    <div
                      key={room.id}
                      className={s.itemAnim}
                      style={{ animationDelay: `${Math.min(roomIndex, 10) * 30}ms` }}
                    >
                      <ChannelsRoomItem room={room} onNavigate={onNavigate} />
                    </div>
                  ))}
                </div>
              )),
            )}
        </div>
      </ScrollArea>
    </>
  );
};
