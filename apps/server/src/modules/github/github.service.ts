import { appDownloadsSchema } from '@chatovo/schemas';
import { BadGatewayException, HttpException, Injectable } from '@nestjs/common';

import {
  DESKTOP_TAG_PREFIXES,
  fetchGitHubReleases,
  findLatestByTagPrefix,
  findLatestUnifiedRelease,
  MOBILE_TAG_PREFIXES,
  parseReleaseVersion,
  splitReleaseAssets,
} from './lib';

@Injectable()
export class GithubService {
  async getLatestRelease() {
    try {
      const releases = await fetchGitHubReleases();
      const unified = findLatestUnifiedRelease(releases);

      if (unified) {
        const { desktop_assets } = splitReleaseAssets(unified.assets);

        return { ...unified, assets: desktop_assets };
      }

      const desktop = findLatestByTagPrefix(releases, [...DESKTOP_TAG_PREFIXES]);

      if (!desktop) {
        throw new BadGatewayException('No release found');
      }

      return desktop;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadGatewayException('Failed to fetch latest release');
    }
  }

  async getAppDownloads() {
    try {
      const releases = await fetchGitHubReleases();
      const unified = findLatestUnifiedRelease(releases);

      if (unified) {
        const { desktop_assets, mobile_assets } = splitReleaseAssets(unified.assets);

        return appDownloadsSchema.parse({
          version: parseReleaseVersion(unified.tag_name),
          html_url: unified.html_url,
          published_at: unified.published_at,
          desktop_assets,
          mobile_assets,
        });
      }

      const desktop = findLatestByTagPrefix(releases, [...DESKTOP_TAG_PREFIXES]);
      const mobile = findLatestByTagPrefix(releases, [...MOBILE_TAG_PREFIXES]);
      const source = desktop ?? mobile;

      if (!source) {
        throw new BadGatewayException('No releases found');
      }

      return appDownloadsSchema.parse({
        version: parseReleaseVersion(source.tag_name),
        html_url: source.html_url,
        published_at: source.published_at,
        desktop_assets: desktop?.assets ?? [],
        mobile_assets: mobile?.assets ?? [],
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadGatewayException('Failed to fetch app downloads');
    }
  }
}
