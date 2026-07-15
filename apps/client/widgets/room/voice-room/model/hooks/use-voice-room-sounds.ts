'use client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { useAudio, usePrevious } from '@siberiacancode/reactuse';
import { ParticipantEvent, RoomEvent, Track, type TrackPublication } from 'livekit-client';
import { useEffect, useEffectEvent, useRef } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { useLeaveSound } from '@/entities/room/room';
import { useDeafen } from '@/features/room/room-control';
import { useEmitterEvent } from '@/shared/hooks';
import { appEvents } from '@/shared/lib';
import { SOUND_CATEGORY, SOUND_SRC, type SoundKey } from '../../config';

export const useVoiceRoomSounds = (roomId: string) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const playLeave = useLeaveSound();

  const { isDeafened } = useDeafen();
  const { settings } = useAppSettings();

  const audioRef = useRef<Record<SoundKey, ReturnType<typeof useAudio>>>({
    join: useAudio(SOUND_SRC.join, { interrupt: true }),
    reconnect: useAudio(SOUND_SRC.reconnect, { interrupt: true }),
    mute: useAudio(SOUND_SRC.mute, { interrupt: true }),
    unmute: useAudio(SOUND_SRC.unmute, { interrupt: true }),
    ptt: useAudio(SOUND_SRC.ptt, { interrupt: true }),
    deafen: useAudio(SOUND_SRC.deafen, { interrupt: true }),
    undeafen: useAudio(SOUND_SRC.undeafen, { interrupt: true }),
    message: useAudio(SOUND_SRC.message, { interrupt: true }),
    reaction: useAudio(SOUND_SRC.reaction, { interrupt: true }),
  });

  const soundsRef = useRef(settings.sounds);
  soundsRef.current = settings.sounds;

  const play = (key: SoundKey) => {
    const { enabled, volume } = soundsRef.current;
    if (!enabled[SOUND_CATEGORY[key]]) {
      return;
    }

    const audio = audioRef.current[key];
    audio.setVolume(volume);
    audio.play();
  };

  const playLeaveSound = () => {
    if (soundsRef.current.enabled.leave) {
      playLeave(soundsRef.current.volume);
    }
  };

  const hasLeftRef = useRef(false);
  const playOwnLeaveOnce = () => {
    if (hasLeftRef.current) {
      return;
    }
    hasLeftRef.current = true;

    playLeaveSound();
  };

  appEvents.on.pttHold(() => play('ptt'));
  appEvents.on.reaction(() => play('reaction'));
  appEvents.on.chatMessage(({ roomId: eventRoomId, senderId }) => {
    if (eventRoomId !== roomId || senderId === localParticipant.identity) {
      return;
    }

    play('message');
  });

  const prevDeafened = usePrevious(isDeafened);

  const onDeafenChange = useEffectEvent(() => play(isDeafened ? 'deafen' : 'undeafen'));
  const onRoomEnter = useEffectEvent(() => play('join'));
  const onRoomLeave = useEffectEvent(() => playOwnLeaveOnce());

  useEffect(() => {
    if (prevDeafened === undefined || prevDeafened === isDeafened) {
      return;
    }

    onDeafenChange();
  }, [isDeafened, prevDeafened]);

  useEffect(() => {
    hasLeftRef.current = false;

    if (room.state === 'connected') {
      onRoomEnter();
    }

    return () => onRoomLeave();
  }, [room]);

  useEmitterEvent(room, RoomEvent.Connected, () => play('join'));
  useEmitterEvent(room, RoomEvent.Reconnecting, () => play('reconnect'));
  useEmitterEvent(room, RoomEvent.SignalReconnecting, () => play('reconnect'));
  useEmitterEvent(room, RoomEvent.Disconnected, () => playOwnLeaveOnce());
  useEmitterEvent(room, RoomEvent.ParticipantConnected, () => play('join'));
  useEmitterEvent(room, RoomEvent.ParticipantDisconnected, () => playLeaveSound());

  useEmitterEvent(
    localParticipant,
    ParticipantEvent.TrackMuted,
    (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) {
        play('mute');
      }
    },
  );

  useEmitterEvent(
    localParticipant,
    ParticipantEvent.TrackUnmuted,
    (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) {
        play('unmute');
      }
    },
  );
};
