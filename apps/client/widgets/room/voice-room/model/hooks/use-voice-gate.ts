'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { LocalAudioTrack, ParticipantEvent, Track } from 'livekit-client';
import { useEffect, useRef } from 'react';
import { isNullish } from 'remeda';
import { useAppSettings, VoiceGateProcessor } from '@/entities/app/settings';

export const useVoiceGate = () => {
  const { settings } = useAppSettings();
  const { localParticipant } = useLocalParticipant();

  const { activationMode, autoSensitivity, micThreshold } = settings.audio;
  const enabled = activationMode === 'voiceActivity';

  const processorRef = useRef<VoiceGateProcessor | null>(null);

  const paramsRef = useRef({ autoSensitivity, threshold: micThreshold });

  useEffect(() => {
    const params = { autoSensitivity, threshold: micThreshold };

    paramsRef.current = params;
    processorRef.current?.update(params);
  }, [autoSensitivity, micThreshold]);

  useEffect(() => {
    if (isNullish(localParticipant) || !enabled) {
      return;
    }

    const getMicTrack = () => {
      const track = localParticipant.getTrackPublication(Track.Source.Microphone)?.track;

      return track instanceof LocalAudioTrack ? track : undefined;
    };

    const attach = async () => {
      const track = getMicTrack();
      if (isNullish(track) || processorRef.current) {
        return;
      }

      const processor = new VoiceGateProcessor(paramsRef.current);
      processorRef.current = processor;

      try {
        await track.setProcessor(processor);
      } catch (err) {
        console.error('voice gate: setProcessor failed', err);
        processorRef.current = null;
      }
    };

    const detach = async () => {
      const processor = processorRef.current;
      processorRef.current = null;

      if (isNullish(processor)) {
        return;
      }

      const track = getMicTrack();
      try {
        await track?.stopProcessor();
      } catch {}
    };

    attach();

    localParticipant.on(ParticipantEvent.LocalTrackPublished, attach);
    localParticipant.on(ParticipantEvent.LocalTrackUnpublished, detach);

    return () => {
      localParticipant.off(ParticipantEvent.LocalTrackPublished, attach);
      localParticipant.off(ParticipantEvent.LocalTrackUnpublished, detach);

      detach();
    };
  }, [localParticipant, enabled]);
};
