'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useRoomToken } from '@/entities/room';
import { ROUTES } from '@/shared/constants';
import { VoiceRoom } from '@/widgets/voice-room';

import type { RoomActiveProps } from './RoomActive.types';

import { roomActiveStyles as s } from './RoomActive.styles';

export const RoomActive = ({ choices, displayName, token, url }: RoomActiveProps) => {
  const router = useRouter();

  const tokenMutation = useRoomToken();

  return (
    <div className={s.root}>
      <div className={s.frame}>
        <VoiceRoom
          roomName={displayName}
          serverUrl={url}
          token={token}
          userChoices={choices}
          onConnectFailure={(reason) => {
            toast.error('Failed to join room', { description: `LiveKit: ${reason}` });
            tokenMutation.reset();
            router.replace(ROUTES.lobby);
          }}
          onLeave={() => router.replace(ROUTES.lobby)}
        />
      </div>
    </div>
  );
};
