'use client';

import { match, P } from 'ts-pattern';

import { useRoomPage } from '../model/hooks';
import { RoomConnecting, RoomLoadingFallback, RoomNotFound } from './components';

export const RoomPage = () => {
  const { isLoading, isSessionOpen, room, roomId } = useRoomPage();

  return match({ roomId, isLoading, room, isSessionOpen })
    .with({ roomId: P.nullish }, () => null)
    .with({ isSessionOpen: true }, () => null)
    .with({ room: P.nullish, isLoading: true }, () => <RoomLoadingFallback />)
    .with({ room: P.nullish }, () => <RoomNotFound />)
    .otherwise(() => <RoomConnecting />);
};
