import { gitHubReleaseListSchema } from '@chatovo/schemas';
import type { GitHubRelease } from '@chatovo/schemas';

const REPO = 'Zilero232/Chatovo';

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'chatovo-server',
};

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

export const parseReleaseVersion = (tagName: string): string =>
  tagName.replace(/^(desktop|mobile|web|app)-v/i, '');

export const DESKTOP_TAG_PREFIXES = ['desktop-v', 'app-v'] as const;
export const MOBILE_TAG_PREFIXES = ['mobile-v', 'android-v'] as const;
