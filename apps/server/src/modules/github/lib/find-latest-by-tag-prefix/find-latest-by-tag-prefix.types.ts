import type { GitHubRelease } from '@chatovo/schemas';

export type FindLatestByTagPrefixInput = {
  releases: GitHubRelease[];
  prefixes: string[];
};
