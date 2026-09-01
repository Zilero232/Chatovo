import type { GitHubReleaseAsset } from '@chatovo/schemas';

import { partition } from 'remeda';

import { isApkAsset } from '../is-apk-asset';

export const splitReleaseAssets = (
  assets: GitHubReleaseAsset[]
): { desktop_assets: GitHubReleaseAsset[]; mobile_assets: GitHubReleaseAsset[] } => {
  const [mobile_assets, desktop_assets] = partition(assets, isApkAsset);

  return { desktop_assets, mobile_assets };
};
