'use client';

import { useTranslations } from 'next-intl';

import { Switch } from '@/shared/ui';
import { SettingRow } from '../../../../components/SettingRow';
import { AUDIO_FLAGS } from '../../AudioTab.config';

import type { AudioProcessingSectionProps } from './AudioProcessingSection.types';

export const AudioProcessingSection = ({ audio, onFlagChange }: AudioProcessingSectionProps) => {
  const t = useTranslations('settings.audio');

  return (
    <>
      {AUDIO_FLAGS.map((flag) => (
        <SettingRow
          key={flag}
          label={t(flag)}
          hint={t(`${flag}Hint`)}
          control={
            <Switch checked={audio[flag]} onCheckedChange={(value) => onFlagChange(flag, value)} />
          }
        />
      ))}
    </>
  );
};
