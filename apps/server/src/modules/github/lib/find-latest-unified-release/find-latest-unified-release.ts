import type { GitHubRelease } from '@chatovo/schemas';

import { find } from 'remeda';

import { UNIFIED_TAG_RE } from '../../config';

export const findLatestUnifiedRelease = (releases: GitHubRelease[]): GitHubRelease | null =>
  find(releases, (release) => UNIFIED_TAG_RE.test(release.tag_name)) ?? null;
