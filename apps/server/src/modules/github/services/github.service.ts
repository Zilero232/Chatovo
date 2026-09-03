import { appDownloadsSchema, gitHubContributorListSchema } from '@chatovo/schemas';
import { BadGatewayException, HttpException, Injectable } from '@nestjs/common';

import { DESKTOP_TAG_PREFIXES } from '../config';
import {
  fetchGitHubContributors,
  fetchGitHubReleases,
  findLatestByTagPrefix,
  findLatestUnifiedRelease,
  parseReleaseVersion
} from '../lib';

@Injectable()
export class GithubService {
  async getAppDownloads() {
    try {
      const releases = await fetchGitHubReleases();
      const unified = findLatestUnifiedRelease(releases);

      if (unified) {
        const desktop_assets = unified.assets;

        return appDownloadsSchema.parse({
          version: parseReleaseVersion(unified.tag_name),
          html_url: unified.html_url,
          published_at: unified.published_at,
          desktop_assets
        });
      }

      const desktop = findLatestByTagPrefix({ releases, prefixes: [...DESKTOP_TAG_PREFIXES] });

      if (!desktop) {
        throw new BadGatewayException('No releases found');
      }

      return appDownloadsSchema.parse({
        version: parseReleaseVersion(desktop.tag_name),
        html_url: desktop.html_url,
        published_at: desktop.published_at,
        desktop_assets: desktop.assets
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadGatewayException('Failed to fetch app downloads');
    }
  }

  async getContributors() {
    try {
      const contributors = await fetchGitHubContributors();

      return gitHubContributorListSchema.parse(contributors);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadGatewayException('Failed to reach GitHub');
    }
  }
}
