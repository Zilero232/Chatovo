import { Apple, AppWindow, Smartphone, Terminal } from 'lucide-react';
import type { DownloadPlatform } from '../model/types';

export type DownloadPlatformConfig = {
  Icon: typeof Apple;
  id: DownloadPlatform;
  labelKey: 'android' | 'linux' | 'macos' | 'windows';
};

export const DOWNLOAD_PLATFORMS: DownloadPlatformConfig[] = [
  { id: 'windows', labelKey: 'windows', Icon: AppWindow },
  { id: 'macos', labelKey: 'macos', Icon: Apple },
  { id: 'linux', labelKey: 'linux', Icon: Terminal },
  { id: 'android', labelKey: 'android', Icon: Smartphone },
];

export const DESKTOP_DOWNLOAD_PLATFORMS = DOWNLOAD_PLATFORMS.filter((p) => p.id !== 'android');
export const MOBILE_DOWNLOAD_PLATFORMS = DOWNLOAD_PLATFORMS.filter((p) => p.id === 'android');

export const EXTENSION_TO_PLATFORM: Record<string, DownloadPlatform> = {
  msi: 'windows',
  exe: 'windows',
  dmg: 'macos',
  app: 'macos',
  deb: 'linux',
  appimage: 'linux',
  rpm: 'linux',
  apk: 'android',
};

const APK_PREFERENCE = ['universal', 'arm64-v8a', 'aarch64', 'armeabi-v7a'] as const;

export const pickPreferredApk = <T extends { name: string }>(assets: T[]): T | null => {
  const apks = assets.filter((asset) => asset.name.toLowerCase().endsWith('.apk'));

  if (apks.length === 0) {
    return null;
  }

  for (const hint of APK_PREFERENCE) {
    const match = apks.find((apk) => apk.name.toLowerCase().includes(hint));

    if (match) {
      return match;
    }
  }

  return apks[0] ?? null;
};
