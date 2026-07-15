'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { createAudioAnalyser, LocalAudioTrack, ParticipantEvent, Track } from 'livekit-client';
import { useEffect, useEffectEvent } from 'react';
import { isNullish } from 'remeda';

import { PTT_SPEAKING_LEVEL } from '../../config';

export const usePttLocalSpeaking = (
  enabled: boolean,
  setIsSpeaking: (speaking: boolean) => void,
) => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  const setSpeaking = useEffectEvent(setIsSpeaking);

  useEffect(() => {
    if (!enabled || isNullish(localParticipant) || !isMicrophoneEnabled) {
      setSpeaking(false);

      return;
    }

    const getMicTrack = () => {
      const track = localParticipant.getTrackPublication(Track.Source.Microphone)?.track;

      return track instanceof LocalAudioTrack ? track : undefined;
    };

    let rafId = 0;
    let analyser: ReturnType<typeof createAudioAnalyser> | null = null;

    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      analyser?.cleanup();
      analyser = null;
    };

    const tick = () => {
      const stream = getMicTrack()?.mediaStreamTrack;
      const streamOpen = stream?.enabled ?? false;
      const level = analyser?.calculateVolume() ?? 0;

      setSpeaking(streamOpen && level > PTT_SPEAKING_LEVEL);
      rafId = requestAnimationFrame(tick);
    };

    const attach = () => {
      stop();

      const track = getMicTrack();
      if (isNullish(track)) {
        setSpeaking(false);

        return;
      }

      analyser = createAudioAnalyser(track);
      tick();
    };

    const onUnpublished = () => {
      stop();
      setSpeaking(false);
    };

    attach();

    localParticipant.on(ParticipantEvent.LocalTrackPublished, attach);
    localParticipant.on(ParticipantEvent.LocalTrackUnpublished, onUnpublished);

    return () => {
      localParticipant.off(ParticipantEvent.LocalTrackPublished, attach);
      localParticipant.off(ParticipantEvent.LocalTrackUnpublished, onUnpublished);
      stop();
      setSpeaking(false);
    };
  }, [enabled, isMicrophoneEnabled, localParticipant]);
};
