'use client';

import { useTranslations } from 'next-intl';

import { DeviceSelect } from '../../../../components/DeviceSelect';
import { SettingRow } from '../../../../components/SettingRow';

export const AudioDevicesSection = () => {
  const t = useTranslations('settings.audio');
  const tDevices = useTranslations('settings.devices');

  return (
    <>
      <SettingRow
        label={t('microphone')}
        hint={t('microphoneHint')}
        control={<DeviceSelect kind="audioinput" />}
        stacked
      />

      <SettingRow
        label={t('speakers')}
        hint={t('speakersHint')}
        control={<DeviceSelect kind="audiooutput" emptyLabel={tDevices('systemDefault')} />}
        stacked
      />
    </>
  );
};
