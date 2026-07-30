'use client';

import { useTranslations } from 'next-intl';

import { Switch } from '@/shared/ui';

import type { SensitivitySectionProps } from './SensitivitySection.types';

import { SensitivityControl } from '../../../../components/SensitivityControl';
import { SettingRow } from '../../../../components/SettingRow';

export const SensitivitySection = ({
  audio,
  deviceId,
  onAutoSensitivityChange
}: SensitivitySectionProps) => {
  const t = useTranslations('settings.audio');

  return (
    <>
      <SettingRow
        control={
          <Switch checked={audio.autoSensitivity} onCheckedChange={onAutoSensitivityChange} />
        }
        hint={t('autoSensitivityHint')}
        label={t('autoSensitivity')}
      />

      {!audio.autoSensitivity && (
        <SettingRow
          stacked
          control={<SensitivityControl audio={audio} deviceId={deviceId} />}
          hint={t('sensitivityHint')}
          label={t('sensitivity')}
        />
      )}
    </>
  );
};
