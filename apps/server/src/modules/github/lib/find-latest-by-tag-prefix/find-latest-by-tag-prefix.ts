import type { GitHubRelease } from '@chatovo/schemas';

import type { FindLatestByTagPrefixInput } from './find-latest-by-tag-prefix.types';

export const findLatestByTagPrefix = ({
  releases,
  prefixes
}: FindLatestByTagPrefixInput): GitHubRelease | null => {
  for (const release of releases) {
    if (!prefixes.some((prefix) => release.tag_name.startsWith(prefix))) {
      continue;
    }

    return release;
  }

  return null;
};
