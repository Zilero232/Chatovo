import type { AudioCaptureOptions } from 'livekit-client';

import type { ShortcutSettings } from '@/entities/app/shortcut';

export type SoundCategory =
  'call' | 'join' | 'leave' | 'message' | 'mute' | 'reaction' | 'reconnect';

export type MicActivationMode = 'pushToTalk' | 'voiceActivity';

export type AudioSettings = {
  [
    K in keyof Pick<
      AudioCaptureOptions,
      'autoGainControl' | 'echoCancellation' | 'noiseSuppression' | 'voiceIsolation'
    >
  ]-?: boolean;
} & {
  activationMode: MicActivationMode;
  autoSensitivity: boolean;
  micThreshold: number;
};

export type VideoQuality = '1080p' | '1440p' | '4k' | '720p';

export type ScreenQuality = '1080p15' | '1080p30' | '1440p30' | '4k30';

export type VideoSettings = {
  cameraQuality: VideoQuality;
  mirrorVideo: boolean;
  screenQuality: ScreenQuality;
};

export type DeviceSettings = {
  audioInput: string;
  audioOutput: string;
  videoInput: string;
};

export type SoundSettings = {
  enabled: Record<SoundCategory, boolean>;
  volume: number;
};

export type TraySettings = {
  closeToTray: boolean;
};

export type SystemSettings = {
  tray: TraySettings;
};

export type { ShortcutActionId, ShortcutBinding, ShortcutSettings } from '@/entities/app/shortcut';

export type AppSettings = {
  audio: AudioSettings;
  devices: DeviceSettings;
  shortcuts: ShortcutSettings;
  sounds: SoundSettings;
  system: SystemSettings;
  video: VideoSettings;
};

export type SettingsGroup = keyof AppSettings;

export type UseAppSettings = {
  settings: AppSettings;
  setGroup: <G extends SettingsGroup>(group: G, patch: Partial<AppSettings[G]>) => void;
  toggleSound: (category: SoundCategory) => void;
};
