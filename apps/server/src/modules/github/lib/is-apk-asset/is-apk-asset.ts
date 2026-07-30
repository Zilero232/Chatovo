import type { GitHubReleaseAsset } from '@chatovo/schemas';

export const isApkAsset = (asset: GitHubReleaseAsset): boolean =>
  asset.name.toLowerCase().endsWith('.apk');
