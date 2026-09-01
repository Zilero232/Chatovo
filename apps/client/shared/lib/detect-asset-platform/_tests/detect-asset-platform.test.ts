import { describe, expect, it } from 'vitest';

import { detectAssetPlatform } from '../detect-asset-platform';

const MAP = { exe: 'windows', dmg: 'macos', appimage: 'linux' } as const;

describe('detectAssetPlatform', () => {
  it('maps a known extension to its platform', () => {
    expect(detectAssetPlatform('Chatovo_1.3.3_x64.exe', MAP)).toBe('windows');
    expect(detectAssetPlatform('Chatovo.dmg', MAP)).toBe('macos');
  });

  it('is case-insensitive', () => {
    expect(detectAssetPlatform('Chatovo.EXE', MAP)).toBe('windows');
    expect(detectAssetPlatform('Chatovo.AppImage', MAP)).toBe('linux');
  });

  it('uses the last extension of a multi-dot name', () => {
    expect(detectAssetPlatform('Chatovo_1.3.3.exe', MAP)).toBe('windows');
  });

  it('returns null for an unknown extension', () => {
    expect(detectAssetPlatform('Chatovo.apk', MAP)).toBeNull();
  });

  it('returns null when there is no extension', () => {
    expect(detectAssetPlatform('Chatovo', MAP)).toBeNull();
    expect(detectAssetPlatform('', MAP)).toBeNull();
  });
});
