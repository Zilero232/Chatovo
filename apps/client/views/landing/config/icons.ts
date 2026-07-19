import {
  AudioWaveform,
  Gauge,
  Keyboard,
  Link2,
  MonitorSmartphone,
  Radio,
  ScreenShare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import type { LandingDesktopKey, LandingFeatureKey } from './sections';

export const LANDING_FEATURE_ICONS: Record<LandingFeatureKey, LucideIcon> = {
  rooms: Sparkles,
  quality: AudioWaveform,
  privacy: ShieldCheck,
  screen: ScreenShare,
  link: Link2,
  free: Gauge,
};

export const LANDING_DESKTOP_ICONS: Record<LandingDesktopKey, LucideIcon> = {
  shortcuts: Keyboard,
  ptt: Radio,
  platforms: MonitorSmartphone,
};
