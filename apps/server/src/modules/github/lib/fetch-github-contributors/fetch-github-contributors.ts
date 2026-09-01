import type { GitHubContributor } from '@chatovo/schemas';

import { gitHubContributorListSchema } from '@chatovo/schemas';

import { CONTRIBUTORS_PER_PAGE, headers, REPO, REQUEST_TIMEOUT_MS } from '../../config';

export const fetchGitHubContributors = async (): Promise<GitHubContributor[]> => {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contributors?per_page=${CONTRIBUTORS_PER_PAGE}`,
    {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch contributors: ${res.status}`);
  }

  const parsed = gitHubContributorListSchema.safeParse(await res.json());

  if (!parsed.success) {
    throw new Error('Invalid contributors payload');
  }

  return parsed.data;
};
