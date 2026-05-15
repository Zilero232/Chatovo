'use client';

import { match } from 'ts-pattern';

import { useRoomState } from '../model/use-room-state';
import {
  RoomActive,
  RoomConnecting,
  RoomLoadingFallback,
  RoomNotFound,
  RoomPasswordForm,
} from './components';

export const RoomPage = () => {
  const state = useRoomState();

  return match(state)
    .with({ kind: 'no-id' }, () => null)
    .with({ kind: 'loading' }, () => <RoomLoadingFallback />)
    .with({ kind: 'not-found' }, () => <RoomNotFound />)
    .with({ kind: 'password' }, ({ displayName, roomId }) => (
      <RoomPasswordForm displayName={displayName} roomId={roomId} />
    ))
    .with({ kind: 'connecting' }, ({ displayName }) => (
      <RoomConnecting displayName={displayName} />
    ))
    .with({ kind: 'active' }, ({ choices, displayName, token, url }) => (
      <RoomActive choices={choices} displayName={displayName} token={token} url={url} />
    ))
    .exhaustive();
};
