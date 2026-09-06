'use client';

import { match, P } from 'ts-pattern';

import { useErrorMessage } from '@/entities/app/locale';

import { useRoomPage } from '../model/hooks';
import { RoomConnecting, RoomLoadingFallback, RoomNotFound, RoomPasswordForm } from './components';

export const RoomPage = () => {
  const errorMessage = useErrorMessage();

  const {
    isLoading,
    isSessionOpen,
    room,
    roomId,
    roomTitle,
    submitPassword,
    tokenError,
    tokenFailed,
    tokenFetching
  } = useRoomPage();

  return match({ roomId, isLoading, room, isSessionOpen })
    .with({ roomId: P.nullish }, () => null)
    .with({ isSessionOpen: true }, () => null)
    .with({ room: P.nullish, isLoading: true }, () => <RoomLoadingFallback />)
    .with({ room: P.nullish }, () => <RoomNotFound />)
    .with({ room: { isPrivate: true } }, () => (
      <RoomPasswordForm
        displayName={roomTitle}
        error={tokenFailed ? errorMessage(tokenError) : undefined}
        isSubmitting={tokenFetching}
        onSubmit={submitPassword}
      />
    ))
    .otherwise(() => <RoomConnecting />);
};
