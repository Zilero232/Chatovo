'use client';

import { toast } from 'sonner';
import { match } from 'ts-pattern';

import { VoiceRoom } from '@/widgets/voice-room';

import { useRoomState } from '../model/use-room-state';
import { RoomConnecting, RoomLoadingFallback, RoomNotFound, RoomPasswordForm } from './components';

export const RoomPage = () => {
  const state = useRoomState();

  return match(state)
    .with({ kind: 'no-id' }, () => null)
    .with({ kind: 'loading' }, () => <RoomLoadingFallback />)
    .with({ kind: 'not-found' }, () => <RoomNotFound />)
    .with({ kind: 'password' }, ({ displayName, error, isSubmitting, onSubmit }) => (
      <RoomPasswordForm
        displayName={displayName}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    ))
    .with({ kind: 'connecting' }, ({ displayName }) => <RoomConnecting displayName={displayName} />)
    .with({ kind: 'active' }, ({ displayName, onConnectFailure, onLeave, roomId, token, url }) => (
      <VoiceRoom
        key={roomId}
        roomName={displayName}
        serverUrl={url}
        token={token}
        onConnectFailure={(reason) => {
          toast.error('Failed to join room', { description: `LiveKit: ${reason}` });
          onConnectFailure();
        }}
        onLeave={onLeave}
      />
    ))
    .exhaustive();
};
