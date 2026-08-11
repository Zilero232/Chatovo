import type { RoomsFilter, RoomsFilterCounts } from '@/entities/room/room';

import type { LobbyRoomsView } from '../../LobbyRooms.types';

export type LobbyRoomsSearchProps = {
  counts: RoomsFilterCounts;
  filter: RoomsFilter;
  query: string;
  view: LobbyRoomsView;
  onFilterChange: (filter: RoomsFilter) => void;
  onQueryChange: (query: string) => void;
  onViewChange: (view: LobbyRoomsView) => void;
};
