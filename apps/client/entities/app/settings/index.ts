export { DEFAULT_APP_SETTINGS, KIND_TO_SLOT } from './config/config';
export { audioConstraints } from './lib/audio-constraints';
export {
  VOICE_GATE_MANUAL_RANGE,
  VoiceGateProcessor,
} from './lib/voice-gate/voice-gate-processor';
export { useAppSettings } from './model/hooks';
export type { VoiceGateParams } from './lib/voice-gate/voice-gate-processor';
export type {
  AppSettings,
  AudioSettings,
  DeviceSettings,
  MicActivationMode,
  ShortcutActionId,
  ShortcutBinding,
  ShortcutSettings,
  SoundCategory,
  SoundSettings,
  SystemSettings,
  TraySettings,
  VideoSettings,
} from './model/types';
