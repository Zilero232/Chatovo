import type { LucideIcon } from 'lucide-react';

import { AudioWaveform, MonitorSmartphone, Zap } from 'lucide-react';

type AuthFeature = {
  Icon: LucideIcon;
  key: 'everywhere' | 'quality' | 'rooms';
};

export const AUTH_FEATURES: AuthFeature[] = [
  { key: 'rooms', Icon: Zap },
  { key: 'quality', Icon: AudioWaveform },
  { key: 'everywhere', Icon: MonitorSmartphone }
];
