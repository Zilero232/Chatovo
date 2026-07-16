'use client';

import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { isTauriDesktop } from '@/shared/lib';
import { MicTest } from '../../components/MicTest';
import { SettingRow } from '../../components/SettingRow';
import {
  AudioDevicesSection,
  AudioProcessingSection,
  MicActivationSection,
  SensitivitySection,
} from './components';

import s from '../../AppSettingsButton.module.scss';

import type { AudioSettings, MicActivationMode } from '@/entities/app/settings';
import type { AudioTabProps } from './AudioTab.types';

export const AudioTab = ({ onJumpToShortcuts }: AudioTabProps) => {
  const t = useTranslations('settings.audio');
  const { settings, setGroup } = useAppSettings();

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
        <MicActivationSection
          activationMode={audio.activationMode}
          pttBindingMissing={pttBindingMissing}
          onActivationModeChange={setActivationMode}
          onJumpToShortcuts={onJumpToShortcuts}
        />
      )}

      <AudioDevicesSection />

      {showVoiceActivityControls && (
        <SensitivitySection
          audio={audio}
          deviceId={settings.devices.audioInput}
          onAutoSensitivityChange={(value) => setGroup('audio', { autoSensitivity: value })}
        />
      )}

      <SettingRow
        label={t('testMic')}
        hint={t('testMicHint')}
        control={<MicTest deviceId={settings.devices.audioInput} audio={audio} />}
        stacked
      />

      <AudioProcessingSection audio={audio} onFlagChange={setFlag} />
    </div>
  );
};
