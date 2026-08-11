import type { GitHubRelease } from '@chatovo/schemas';

import { gitHubReleaseListSchema } from '@chatovo/schemas';

import { headers, REPO, REQUEST_TIMEOUT_MS } from '../../config';

export const fetchGitHubReleases = async (): Promise<GitHubRelease[]> => {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=50`, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
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
