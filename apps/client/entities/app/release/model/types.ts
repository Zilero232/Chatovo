export type DownloadPlatform = 'linux' | 'macos' | 'windows';

export type ReleaseAsset = {
  downloadUrl: string;
  name: string;
  platform: DownloadPlatform;
  sizeBytes: number;
};

export type Release = {
  assets: Partial<Record<DownloadPlatform, ReleaseAsset>>;
  htmlUrl: string;
  publishedAt: string;
  version: string;
};
