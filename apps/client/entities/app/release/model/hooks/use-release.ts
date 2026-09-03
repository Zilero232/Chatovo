import { useQuery } from '@tanstack/react-query';
import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';

import { getAppDownloads } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';
import { detectAssetPlatform } from '@/shared/lib';

import type { DownloadPlatform, Release, ReleaseAsset } from '../types';

import { EXTENSION_TO_PLATFORM } from '../../config';

export const useRelease = (enabled = true) =>
  useQuery({
    queryKey: QUERY_KEYS.release(),
    enabled,
    retry: 1,
    staleTime: minutesToMilliseconds(30),
    gcTime: hoursToMilliseconds(2),
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Release> => {
      const data = await getAppDownloads();
      const assets: Partial<Record<DownloadPlatform, ReleaseAsset>> = {};

      for (const asset of data.desktop_assets) {
        const platform = detectAssetPlatform(asset.name, EXTENSION_TO_PLATFORM);

        if (!platform || assets[platform]) {
          continue;
        }

        assets[platform] = {
          platform,
          name: asset.name,
          sizeBytes: asset.size,
          downloadUrl: asset.browser_download_url
        };
      }

      return {
        assets,
        htmlUrl: data.html_url,
        publishedAt: data.published_at,
        version: data.version
      };
    }
  });
