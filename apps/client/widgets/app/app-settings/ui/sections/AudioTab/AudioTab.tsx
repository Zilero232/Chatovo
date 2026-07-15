'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { isNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { isTauriDesktop } from '@/shared/lib';
import { RadioGroup, RadioGroupItem, Switch } from '@/shared/ui';
import { DeviceSelect } from '../../components/DeviceSelect';
import { MicTest } from '../../components/MicTest';
import { SensitivityControl } from '../../components/SensitivityControl';
import { SettingRow } from '../../components/SettingRow';

import s from '../../AppSettingsButton.module.scss';

import type { AudioSettings, MicActivationMode } from '@/entities/app/settings';
import type { AudioTabProps } from './AudioTab.types';

const AUDIO_FLAGS = [
  'noiseSuppression',
  'echoCancellation',
  'autoGainControl',
  'voiceIsolation',
] satisfies (keyof AudioSettings)[];

export const AudioTab = ({ onJumpToShortcuts }: AudioTabProps) => {
  const t = useTranslations('settings.audio');
  const tDevices = useTranslations('settings.devices');
  const { settings, setGroup } = useAppSettings();

  const voiceId = useId();
  const pttId = useId();

  const audio = settings.audio;
  const isDesktop = isTauriDesktop();
  const pttBindingMissing =
    audio.activationMode === 'pushToTalk' && isNullish(settings.shortcuts.pttHold);

  const setFlag = (key: keyof AudioSettings, value: boolean) => {
    setGroup('audio', { [key]: value });
  };

  const setActivationMode = (value: MicActivationMode) => {
    setGroup('audio', { activationMode: value });
  };

  const showVoiceActivityControls = !isDesktop || audio.activationMode === 'voiceActivity';

  return (
    <div className={s.tabPanel}>
      {isDesktop && (
        <>
          <SettingRow
            label={t('activation')}
            hint={t('activationHint')}
            control={
              <RadioGroup
                className={s.radioGroup}
                value={audio.activationMode}
                onValueChange={(value) => setActivationMode(value as MicActivationMode)}
              >
                <label className={s.radioLabel} htmlFor={voiceId}>
                  <RadioGroupItem id={voiceId} value="voiceActivity" />
                  {t('activationVoice')}
                </label>
                <label className={s.radioLabel} htmlFor={pttId}>
                  <RadioGroupItem id={pttId} value="pushToTalk" />
                  {t('activationPtt')}
                </label>
              </RadioGroup>
            }
          />

          {pttBindingMissing && (
            <span className={s.rowHintTight}>
              {t.rich('activationPttNoBinding', {
                link: (chunks) => (
                  <button className={s.linkButton} type="button" onClick={onJumpToShortcuts}>
                    {chunks}
                  </button>
                ),
              })}
            </span>
          )}
        </>
      )}

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

      {showVoiceActivityControls && (
        <>
          <SettingRow
            label={t('autoSensitivity')}
            hint={t('autoSensitivityHint')}
            control={
              <Switch
                checked={audio.autoSensitivity}
                onCheckedChange={(value) => setGroup('audio', { autoSensitivity: value })}
              />
            }
          />

          {!audio.autoSensitivity && (
            <SettingRow
              label={t('sensitivity')}
              hint={t('sensitivityHint')}
              control={<SensitivityControl audio={audio} deviceId={settings.devices.audioInput} />}
              stacked
            />
          )}
        </>
      )}

      <SettingRow
        label={t('testMic')}
        hint={t('testMicHint')}
        control={<MicTest deviceId={settings.devices.audioInput} audio={audio} />}
        stacked
      />

      {AUDIO_FLAGS.map((flag) => (
        <SettingRow
          key={flag}
          label={t(flag)}
          hint={t(`${flag}Hint`)}
          control={
            <Switch checked={audio[flag]} onCheckedChange={(value) => setFlag(flag, value)} />
          }
        />
      ))}
    </div>
  );
};
