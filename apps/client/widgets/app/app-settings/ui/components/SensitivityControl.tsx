'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Slider as RACSlider, SliderThumb, SliderTrack } from 'react-aria-components';

import {
  useAppSettings,
  VOICE_GATE_MANUAL_RANGE,
  VoiceGateDetector,
} from '@/entities/app/settings';
import { formatPercent } from '@/shared/lib';
import { useMicAnalyser } from '../../model/hooks';

import s from '../AppSettingsButton.module.scss';

import type { AudioSettings } from '@/entities/app/settings';

type SensitivityControlProps = {
  deviceId: string;
  audio: AudioSettings;
};

export const SensitivityControl = ({ deviceId, audio }: SensitivityControlProps) => {
  const t = useTranslations('settings.audio');
  const { setGroup } = useAppSettings();

  const level = useMicAnalyser({ deviceId, audio, active: true });
  const gateRef = useRef(new VoiceGateDetector());
  const gateKey = `${audio.autoSensitivity}:${audio.micThreshold}`;
  const gateKeyRef = useRef(gateKey);

  if (gateKeyRef.current !== gateKey) {
    gateKeyRef.current = gateKey;
    gateRef.current.reset();
  }

  const open = gateRef.current.step(level, {
    autoSensitivity: audio.autoSensitivity,
    threshold: audio.micThreshold,
  });

  return (
    <RACSlider
      aria-label={t('sensitivity')}
      className={s.sensitivitySlider}
      maxValue={1}
      minValue={0}
      step={0.01}
      value={audio.micThreshold}
      onChange={(value) => setGroup('audio', { micThreshold: value })}
    >
      <SliderTrack className={s.meterTrack}>
        <div
          className={s.meterFill}
          data-open={open}
          style={{ width: formatPercent(level / VOICE_GATE_MANUAL_RANGE) }}
        />
        <SliderThumb className={s.sensitivityThumb} />
      </SliderTrack>
    </RACSlider>
  );
};
