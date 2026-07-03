import type { AudioCaptureOptions } from 'livekit-client';
import type { ShortcutSettings } from '@/entities/app/shortcut';

export type SoundCategory =
  | 'join'
  | 'leave'
  | 'mute'
  | 'reconnect'
  | 'message'
  | 'reaction'
  | 'call';

export type MicActivationMode = 'voiceActivity' | 'pushToTalk';

export type AudioSettings = {
  [K in keyof Pick<
    AudioCaptureOptions,
    'noiseSuppression' | 'echoCancellation' | 'autoGainControl' | 'voiceIsolation'
  >]-?: boolean;
} & {
  activationMode: MicActivationMode;
  autoSensitivity: boolean;
  micThreshold: number;
};

export type VideoQuality = '720p' | '1080p' | '1440p' | '4k';

export type ScreenQuality = '1080p15' | '1080p30' | '1440p30' | '4k30';

export type VideoSettings = {
  mirrorVideo: boolean;
  cameraQuality: VideoQuality;
  screenQuality: ScreenQuality;
};

export type DeviceSettings = {
  audioInput: string;
  audioOutput: string;
  videoInput: string;
};

export type SoundSettings = {
  volume: number;
  enabled: Record<SoundCategory, boolean>;
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
  video: VideoSettings;
  devices: DeviceSettings;
  sounds: SoundSettings;
  system: SystemSettings;
  shortcuts: ShortcutSettings;
};

export type SettingsGroup = keyof AppSettings;

export type UseAppSettings = {
  settings: AppSettings;
  toggleSound: (category: SoundCategory) => void;
  setGroup: <G extends SettingsGroup>(group: G, patch: Partial<AppSettings[G]>) => void;
};
