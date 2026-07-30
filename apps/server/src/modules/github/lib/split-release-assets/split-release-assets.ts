import type { GitHubReleaseAsset } from '@chatovo/schemas';

import { isApkAsset } from '../is-apk-asset';

export const splitReleaseAssets = (
  assets: GitHubReleaseAsset[]
): { desktop_assets: GitHubReleaseAsset[]; mobile_assets: GitHubReleaseAsset[] } => {
  const desktop_assets: GitHubReleaseAsset[] = [];
  const mobile_assets: GitHubReleaseAsset[] = [];

  for (const asset of assets) {
    if (isApkAsset(asset)) {
      mobile_assets.push(asset);
      continue;
    }

    desktop_assets.push(asset);
  }

  return { desktop_assets, mobile_assets };
};
