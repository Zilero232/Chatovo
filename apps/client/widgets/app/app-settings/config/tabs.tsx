'use client';

import { Keyboard, Mic, Settings2, ShieldCheck, User, Video, Volume2 } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Spinner } from '@/shared/ui';

import s from './tabs.module.scss';

import type { ReactNode } from 'react';

export type SettingsTabId =
  | 'profile'
  | 'audio'
  | 'video'
  | 'sounds'
  | 'system'
  | 'security'
  | 'shortcuts';

export type SettingsTabControls = {
  jumpTo: (id: SettingsTabId) => void;
};

export type SettingsTabConfig = {
  id: SettingsTabId;
  icon: ReactNode;
  tauriDesktopOnly?: boolean;
  render: (controls: SettingsTabControls) => ReactNode;
};

const tabFallback = (
  <div className={s.fallback}>
    <Spinner size="lg" />
  </div>
);

const ProfileTab = dynamic(
  () => import('../ui/sections/ProfileTab').then((m) => ({ default: m.ProfileTab })),
  {
    loading: () => tabFallback,
  },
);

const AudioTab = dynamic(
  () => import('../ui/sections/AudioTab').then((m) => ({ default: m.AudioTab })),
  {
    loading: () => tabFallback,
  },
);

const VideoTab = dynamic(
  () => import('../ui/sections/VideoTab').then((m) => ({ default: m.VideoTab })),
  {
    loading: () => tabFallback,
  },
);

const SoundsTab = dynamic(
  () => import('../ui/sections/SoundsTab').then((m) => ({ default: m.SoundsTab })),
  {
    loading: () => tabFallback,
  },
);

const SystemTab = dynamic(
  () => import('../ui/sections/SystemTab').then((m) => ({ default: m.SystemTab })),
  {
    loading: () => tabFallback,
  },
);

const SecurityTab = dynamic(
  () => import('../ui/sections/SecurityTab').then((m) => ({ default: m.SecurityTab })),
  { loading: () => tabFallback },
);

const ShortcutsTab = dynamic(
  () => import('../ui/sections/ShortcutsTab').then((m) => ({ default: m.ShortcutsTab })),
  { loading: () => tabFallback },
);

export const SETTINGS_TABS: SettingsTabConfig[] = [
  { id: 'profile', icon: <User />, render: () => <ProfileTab /> },
  {
    id: 'audio',
    icon: <Mic />,
    render: ({ jumpTo }) => <AudioTab onJumpToShortcuts={() => jumpTo('shortcuts')} />,
  },
  { id: 'video', icon: <Video />, render: () => <VideoTab /> },
  { id: 'sounds', icon: <Volume2 />, render: () => <SoundsTab /> },
  { id: 'system', icon: <Settings2 />, tauriDesktopOnly: true, render: () => <SystemTab /> },
  { id: 'security', icon: <ShieldCheck />, render: () => <SecurityTab /> },
  { id: 'shortcuts', icon: <Keyboard />, tauriDesktopOnly: true, render: () => <ShortcutsTab /> },
];
