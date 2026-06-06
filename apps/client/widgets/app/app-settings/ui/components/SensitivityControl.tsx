'use client';

import { useTranslations } from 'next-intl';
import { Slider as SliderPrimitive } from 'radix-ui';
import { useAppSettings, VOICE_GATE_MANUAL_RANGE } from '@/entities/app/settings';
import { formatPercent } from '@/shared/lib';
import { useMicAnalyser } from '../../model/hooks';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import type { AudioSettings } from '@/entities/app/settings';

type SensitivityControlProps = {
  deviceId: string;
  audio: AudioSettings;
};

export const SensitivityControl = ({ deviceId, audio }: SensitivityControlProps) => {
  const t = useTranslations('settings.audio');
  const { setGroup } = useAppSettings();

  const level = useMicAnalyser({ deviceId, audio, active: true });

  const threshold = audio.micThreshold * VOICE_GATE_MANUAL_RANGE;
  const open = level >= threshold;

  return (
    <SliderPrimitive.Root
      aria-label={t('sensitivity')}
      className={s.sensitivitySlider}
      max={1}
      min={0}
      step={0.01}
      value={[audio.micThreshold]}
      onValueChange={([value]) => setGroup('audio', { micThreshold: value })}
    >
      <SliderPrimitive.Track className={s.meterTrack}>
        <div
          className={s.meterFill}
          data-open={open}
          style={{ width: formatPercent(level / VOICE_GATE_MANUAL_RANGE) }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={s.sensitivityThumb} />
    </SliderPrimitive.Root>
  );
};
