'use client';

import { useTranslations } from 'next-intl';
import { Switch } from '@/shared/ui';
import { type AudioSettings, useAppSettings } from '../../model';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { DeviceSelect } from '../components/DeviceSelect';
import { MicTest } from '../components/MicTest';
import { SettingRow } from '../components/SettingRow';

export const AudioTab = () => {
  const t = useTranslations('settings.audio');
  const tDevices = useTranslations('settings.devices');

  const { settings, setGroup } = useAppSettings();

  const audio = settings.audio;

  // Only persist here — this dialog opens from the sidebar, outside LiveKitRoom,
  // so it has no room to apply to. useDeviceSync, which runs inside the room,
  // watches the store and re-captures the mic track when these flags change.
  const setFlag = (key: keyof AudioSettings, value: boolean) => {
    setGroup('audio', { [key]: value });
  };

  return (
    <div className={s.tabPanel}>
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

      <SettingRow
        label={t('testMic')}
        hint={t('testMicHint')}
        control={<MicTest deviceId={settings.devices.audioInput} audio={audio} />}
        stacked
      />

      <SettingRow
        label={t('noiseSuppression')}
        hint={t('noiseSuppressionHint')}
        control={
          <Switch
            checked={audio.noiseSuppression}
            onCheckedChange={(value) => setFlag('noiseSuppression', value)}
          />
        }
      />

      <SettingRow
        label={t('echoCancellation')}
        hint={t('echoCancellationHint')}
        control={
          <Switch
            checked={audio.echoCancellation}
            onCheckedChange={(value) => setFlag('echoCancellation', value)}
          />
        }
      />

      <SettingRow
        label={t('autoGainControl')}
        hint={t('autoGainControlHint')}
        control={
          <Switch
            checked={audio.autoGainControl}
            onCheckedChange={(value) => setFlag('autoGainControl', value)}
          />
        }
      />

      <SettingRow
        label={t('voiceIsolation')}
        hint={t('voiceIsolationHint')}
        control={
          <Switch
            checked={audio.voiceIsolation}
            onCheckedChange={(value) => setFlag('voiceIsolation', value)}
          />
        }
      />
    </div>
  );
};
