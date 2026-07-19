import { AudioWaveform, MonitorSmartphone, Zap } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export type AuthFeature = {
  key: 'rooms' | 'quality' | 'everywhere';
  Icon: LucideIcon;
};

export const AUTH_FEATURES: AuthFeature[] = [
  { key: 'rooms', Icon: Zap },
  { key: 'quality', Icon: AudioWaveform },
  { key: 'everywhere', Icon: MonitorSmartphone },
];
