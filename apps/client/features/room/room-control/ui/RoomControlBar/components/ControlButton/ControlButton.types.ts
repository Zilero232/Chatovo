import type { ReactNode } from 'react';
import type { DeviceSettings } from '@/entities/app/settings';
import type { ControlTone } from './control-button-tones';

export type ControlDevice = {
  kind: MediaDeviceKind;
  slot: keyof DeviceSettings;
  label: string;
};

export type ControlButtonProps = {
  icon: ReactNode;
  label: string;
  tone: ControlTone;
  pressed?: boolean;
  disabled?: boolean;
  device?: ControlDevice;
  onClick: () => void;
};
