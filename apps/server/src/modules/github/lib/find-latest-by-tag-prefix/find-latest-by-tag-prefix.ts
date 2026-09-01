import type { GitHubRelease } from '@chatovo/schemas';

import { find } from 'remeda';

import type { FindLatestByTagPrefixInput } from './find-latest-by-tag-prefix.types';

export const findLatestByTagPrefix = ({
  releases,
  prefixes
}: FindLatestByTagPrefixInput): GitHubRelease | null =>
  find(releases, (release) => prefixes.some((prefix) => release.tag_name.startsWith(prefix))) ??
  null;
