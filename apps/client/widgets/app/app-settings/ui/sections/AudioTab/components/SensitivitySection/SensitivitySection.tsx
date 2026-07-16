'use client';

import { useTranslations } from 'next-intl';

import { Switch } from '@/shared/ui';
import { SensitivityControl } from '../../../../components/SensitivityControl';
import { SettingRow } from '../../../../components/SettingRow';

import type { SensitivitySectionProps } from './SensitivitySection.types';

export const SensitivitySection = ({
  audio,
  deviceId,
  onAutoSensitivityChange,
}: SensitivitySectionProps) => {
  const t = useTranslations('settings.audio');

  return (
    <>
      <SettingRow
        label={t('autoSensitivity')}
        hint={t('autoSensitivityHint')}
        control={
          <Switch checked={audio.autoSensitivity} onCheckedChange={onAutoSensitivityChange} />
        }
      />

      {!audio.autoSensitivity && (
        <SettingRow
          label={t('sensitivity')}
          hint={t('sensitivityHint')}
          control={<SensitivityControl audio={audio} deviceId={deviceId} />}
          stacked
        />
      )}
    </>
  );
};
