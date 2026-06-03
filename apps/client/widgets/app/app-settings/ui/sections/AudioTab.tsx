'use client';

import { isTauri } from '@tauri-apps/api/core';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { isNullish } from 'remeda';
import { useAppSettings } from '@/entities/app/settings';
import { RadioGroup, RadioGroupItem, Switch } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
import { DeviceSelect } from '../components/DeviceSelect';
import { MicTest } from '../components/MicTest';
import { SettingRow } from '../components/SettingRow';
import type { AudioSettings, MicActivationMode } from '@/entities/app/settings';

type AudioTabProps = {
  onJumpToShortcuts: () => void;
};

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
  const showPttOption = isTauri();
  const pttBindingMissing =
    audio.activationMode === 'pushToTalk' && isNullish(settings.shortcuts.pttHold);

  const setFlag = (key: keyof AudioSettings, value: boolean) => {
    setGroup('audio', { [key]: value });
  };

  return (
    <div className={s.tabPanel}>
      <SettingRow
        label={t('activation')}
        hint={t('activationHint')}
        control={
          <RadioGroup
            className="flex flex-row flex-wrap items-center gap-x-5 gap-y-2"
            value={audio.activationMode}
            onValueChange={(value) =>
              setGroup('audio', { activationMode: value as MicActivationMode })
            }
          >
            <label className="flex items-center gap-2 text-sm" htmlFor={voiceId}>
              <RadioGroupItem id={voiceId} value="voiceActivity" />
              {t('activationVoice')}
            </label>
            {showPttOption && (
              <label className="flex items-center gap-2 text-sm" htmlFor={pttId}>
                <RadioGroupItem id={pttId} value="pushToTalk" />
                {t('activationPtt')}
              </label>
            )}
          </RadioGroup>
        }
      />
      {pttBindingMissing && (
        <span className={`${s.rowHint} -mt-1`}>
          {t.rich('activationPttNoBinding', {
            link: (chunks) => (
              <button
                className="underline underline-offset-2 hover:text-foreground"
                type="button"
                onClick={onJumpToShortcuts}
              >
                {chunks}
              </button>
            ),
          })}
        </span>
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
