import { gitHubReleaseListSchema } from '@chatovo/schemas';
import type { GitHubRelease, GitHubReleaseAsset } from '@chatovo/schemas';

const REPO = 'Zilero232/Chatovo';

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'chatovo-server',
};

const UNIFIED_TAG_RE = /^v\d+\.\d+\.\d+$/;

export const DESKTOP_TAG_PREFIXES = ['desktop-v', 'app-v'] as const;
export const MOBILE_TAG_PREFIXES = ['mobile-v', 'android-v'] as const;

export const fetchGitHubReleases = async (): Promise<GitHubRelease[]> => {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=50`, {
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch releases: ${res.status}`);
  }

  const parsed = gitHubReleaseListSchema.safeParse(await res.json());

  if (!parsed.success) {
    throw new Error('Invalid releases payload');
  }

  return parsed.data;
};

export const findLatestByTagPrefix = (
  releases: GitHubRelease[],
  prefixes: string[],
): GitHubRelease | null => {
  for (const release of releases) {
    if (!prefixes.some((prefix) => release.tag_name.startsWith(prefix))) {
      continue;
    }

    return release;
  }

  return null;
};

export const findLatestUnifiedRelease = (releases: GitHubRelease[]): GitHubRelease | null => {
  for (const release of releases) {
    if (UNIFIED_TAG_RE.test(release.tag_name)) {
      return release;
    }
  }

  return null;
};

export const isApkAsset = (asset: GitHubReleaseAsset): boolean =>
  asset.name.toLowerCase().endsWith('.apk');

export const splitReleaseAssets = (
  assets: GitHubReleaseAsset[],
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

export const parseReleaseVersion = (tagName: string): string =>
  tagName.replace(/^(?:v|(?:desktop|mobile|web|app)-v)/i, '');
