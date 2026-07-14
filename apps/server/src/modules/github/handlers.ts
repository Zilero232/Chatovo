import { appDownloadsSchema } from '@chatovo/schemas';
import { StatusCodes } from 'http-status-codes';

import {
  DESKTOP_TAG_PREFIXES,
  fetchGitHubReleases,
  findLatestByTagPrefix,
  findLatestUnifiedRelease,
  MOBILE_TAG_PREFIXES,
  parseReleaseVersion,
  splitReleaseAssets,
} from './lib';

import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { appDownloadsRoute, latestReleaseRoute } from './routes';

export const latestReleaseHandler: RouteHandler<typeof latestReleaseRoute, Env> = async (c) => {
  try {
    const releases = await fetchGitHubReleases();
    const unified = findLatestUnifiedRelease(releases);

    if (unified) {
      const { desktop_assets } = splitReleaseAssets(unified.assets);

      return c.json({ ...unified, assets: desktop_assets }, StatusCodes.OK);
    }

    const desktop = findLatestByTagPrefix(releases, [...DESKTOP_TAG_PREFIXES]);

    if (!desktop) {
      return c.json({ error: 'No release found' }, StatusCodes.BAD_GATEWAY);
    }

    return c.json(desktop, StatusCodes.OK);
  } catch {
    return c.json({ error: 'Failed to fetch latest release' }, StatusCodes.BAD_GATEWAY);
  }
};

export const appDownloadsHandler: RouteHandler<typeof appDownloadsRoute, Env> = async (c) => {
  try {
    const releases = await fetchGitHubReleases();
    const unified = findLatestUnifiedRelease(releases);

    if (unified) {
      const { desktop_assets, mobile_assets } = splitReleaseAssets(unified.assets);

      const payload = appDownloadsSchema.parse({
        version: parseReleaseVersion(unified.tag_name),
        html_url: unified.html_url,
        published_at: unified.published_at,
        desktop_assets,
        mobile_assets,
      });

      return c.json(payload, StatusCodes.OK);
    }

    const desktop = findLatestByTagPrefix(releases, [...DESKTOP_TAG_PREFIXES]);
    const mobile = findLatestByTagPrefix(releases, [...MOBILE_TAG_PREFIXES]);
    const source = desktop ?? mobile;

    if (!source) {
      return c.json({ error: 'No releases found' }, StatusCodes.BAD_GATEWAY);
    }

    const payload = appDownloadsSchema.parse({
      version: parseReleaseVersion(source.tag_name),
      html_url: source.html_url,
      published_at: source.published_at,
      desktop_assets: desktop?.assets ?? [],
      mobile_assets: mobile?.assets ?? [],
    });

    return c.json(payload, StatusCodes.OK);
  } catch {
    return c.json({ error: 'Failed to fetch app downloads' }, StatusCodes.BAD_GATEWAY);
  }
};
