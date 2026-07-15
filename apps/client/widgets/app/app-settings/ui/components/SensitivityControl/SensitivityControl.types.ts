import type { AudioSettings } from '@/entities/app/settings';

export type SensitivityControlProps = {
  deviceId: string;
  audio: AudioSettings;
};
