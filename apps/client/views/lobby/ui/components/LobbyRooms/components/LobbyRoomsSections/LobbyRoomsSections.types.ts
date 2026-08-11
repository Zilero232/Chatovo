import type { RoomSection } from '@/entities/room/room';

import type { LobbyRoomsView } from '../../LobbyRooms.types';

export type LobbyRoomsSectionsProps = {
  sections: RoomSection[];
  view: LobbyRoomsView;
};
