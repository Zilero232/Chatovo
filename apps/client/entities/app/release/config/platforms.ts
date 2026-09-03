import { Apple, AppWindow, Terminal } from 'lucide-react';

import type { DownloadPlatform } from '../model/types';

export type DownloadPlatformConfig = {
  Icon: typeof Apple;
  id: DownloadPlatform;
  labelKey: 'linux' | 'macos' | 'windows';
};

export const DOWNLOAD_PLATFORMS: DownloadPlatformConfig[] = [
  { id: 'windows', labelKey: 'windows', Icon: AppWindow },
  { id: 'macos', labelKey: 'macos', Icon: Apple },
  { id: 'linux', labelKey: 'linux', Icon: Terminal }
];

export const EXTENSION_TO_PLATFORM: Record<string, DownloadPlatform> = {
  msi: 'windows',
  exe: 'windows',
  dmg: 'macos',
  app: 'macos',
  deb: 'linux',
  appimage: 'linux',
  rpm: 'linux'
};
