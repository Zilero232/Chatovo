import type { DeviceSettings } from '@/entities/app/settings';

export type DeviceMenuProps = {
  kind: MediaDeviceKind;
  slot: keyof DeviceSettings;
  label: string;
};
