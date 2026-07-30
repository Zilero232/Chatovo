import type { GitHubRelease } from '@chatovo/schemas';

import { UNIFIED_TAG_RE } from '../../config';

export const findLatestUnifiedRelease = (releases: GitHubRelease[]): GitHubRelease | null => {
  for (const release of releases) {
    if (UNIFIED_TAG_RE.test(release.tag_name)) {
      return release;
    }
  }

  return null;
};
