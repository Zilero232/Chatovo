import type { Room } from '@chatovo/schemas';

import type { LobbyRoomsView } from '../LobbyRooms/LobbyRooms.types';

export type LobbyRoomCardProps = {
  room: Room;
  variant?: LobbyRoomsView;
};
