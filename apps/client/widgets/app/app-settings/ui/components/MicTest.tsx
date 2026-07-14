'use client';

import { Mic, MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatPercent } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { useMicTest } from '../../model/hooks';

import s from '../AppSettingsButton.module.scss';

import type { AudioSettings } from '@/entities/app/settings';

type MicTestProps = {
  deviceId: string;
  audio: AudioSettings;
};

export const MicTest = ({ deviceId, audio }: MicTestProps) => {
  const t = useTranslations('settings.audio');
  const { level, isLoopback, toggleLoopback, error } = useMicTest({ deviceId, audio });

  return (
    <div className={s.meterRow}>
      <div className={s.meterTrack}>
        <div
          className={s.meterFill}
          data-open={level > 0.01}
          style={{ width: formatPercent(level) }}
        />
      </div>

      <Button
        aria-label={isLoopback ? t('stopTestMic') : t('testMic')}
        aria-pressed={isLoopback}
        disabled={error}
        size="icon"
        type="button"
        variant={isLoopback ? 'secondary' : 'ghost'}
        onClick={toggleLoopback}
      >
        {isLoopback ? <Mic /> : <MicOff />}
      </Button>
    </div>
  );
};
