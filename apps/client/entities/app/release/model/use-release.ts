import { useQuery } from '@tanstack/react-query';

import { getAppDownloads } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { detectAssetPlatform } from '@/shared/lib';
import { EXTENSION_TO_PLATFORM, pickPreferredApk } from '../config';

import type { DownloadPlatform, Release, ReleaseAsset } from './types';

export const useRelease = (enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.release(),
    enabled,
    retry: 1,
    queryFn: async (): Promise<Release> => {
      const data = await getAppDownloads();
      const assets: Partial<Record<DownloadPlatform, ReleaseAsset>> = {};

      const preferredApk = pickPreferredApk(data.mobile_assets);

      if (preferredApk) {
        assets.android = {
          platform: 'android',
          name: preferredApk.name,
          sizeBytes: preferredApk.size,
          downloadUrl: preferredApk.browser_download_url,
        };
      }

      for (const asset of data.desktop_assets) {
        const platform = detectAssetPlatform(asset.name, EXTENSION_TO_PLATFORM);

        if (!platform || platform === 'android' || assets[platform]) {
          continue;
        }

        assets[platform] = {
          platform,
          name: asset.name,
          sizeBytes: asset.size,
          downloadUrl: asset.browser_download_url,
        };
      }

      return {
        assets,
        htmlUrl: data.html_url,
        publishedAt: data.published_at,
        version: data.version,
      };
    },
  });
};
