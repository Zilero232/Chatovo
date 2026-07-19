'use client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { usePrevious } from '@siberiacancode/reactuse';
import { ParticipantEvent, RoomEvent, Track, type TrackPublication } from 'livekit-client';
import { useEffect, useEffectEvent, useMemo, useRef } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { useLeaveSound } from '@/entities/room/room';
import { useDeafen } from '@/features/room/room-control';
import { useEmitterEvent } from '@/shared/hooks';
import { appEvents } from '@/shared/lib';
import { SOUND_CATEGORY, type SoundKey } from '../../config';
import { createSoundPlayer } from '../../lib';

export const useVoiceRoomSounds = (roomId: string) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const playLeave = useLeaveSound();

  const { isDeafened } = useDeafen();
  const { settings } = useAppSettings();

  const player = useMemo(createSoundPlayer, []);

  useEffect(() => () => player.dispose(), [player]);

  const play = useEffectEvent((key: SoundKey) => {
    const { enabled, volume } = settings.sounds;

    if (enabled[SOUND_CATEGORY[key]]) {
      player.play(key, volume);
    }
  });

  const playLeaveSound = useEffectEvent(() => {
    const { enabled, volume } = settings.sounds;

    if (enabled.leave) {
      playLeave(volume);
    }
  });

  const hasLeftRef = useRef(false);

  const playOwnLeaveOnce = useEffectEvent(() => {
    if (hasLeftRef.current) {
      return;
    }

    hasLeftRef.current = true;
    playLeaveSound();
  });

  appEvents.on.pttHold(() => play('ptt'));
  appEvents.on.reaction(() => play('reaction'));
  appEvents.on.chatMessage(({ roomId: eventRoomId, senderId }) => {
    if (eventRoomId === roomId && senderId !== localParticipant.identity) {
      play('message');
    }
  });

  const prevDeafened = usePrevious(isDeafened);

  useEffect(() => {
    if (prevDeafened !== undefined && prevDeafened !== isDeafened) {
      play(isDeafened ? 'deafen' : 'undeafen');
    }
  }, [isDeafened, prevDeafened]);

  useEffect(() => {
    hasLeftRef.current = false;

    if (room.state === 'connected') {
      play('join');
    }

    return () => playOwnLeaveOnce();
  }, [room]);

  useEmitterEvent(room, RoomEvent.Connected, () => play('join'));
  useEmitterEvent(room, RoomEvent.Reconnecting, () => play('reconnect'));
  useEmitterEvent(room, RoomEvent.SignalReconnecting, () => play('reconnect'));
  useEmitterEvent(room, RoomEvent.Disconnected, () => playOwnLeaveOnce());
  useEmitterEvent(room, RoomEvent.ParticipantConnected, () => play('join'));
  useEmitterEvent(room, RoomEvent.ParticipantDisconnected, () => playLeaveSound());

  const onMicToggle = (key: Extract<SoundKey, 'mute' | 'unmute'>) => {
    return (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) {
        play(key);
      }
    };
  };

  useEmitterEvent(localParticipant, ParticipantEvent.TrackMuted, onMicToggle('mute'));
  useEmitterEvent(localParticipant, ParticipantEvent.TrackUnmuted, onMicToggle('unmute'));
};
