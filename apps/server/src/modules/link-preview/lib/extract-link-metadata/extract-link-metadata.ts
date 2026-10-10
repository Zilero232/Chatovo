import {
  LINK_PREVIEW_DESCRIPTION_MAX_LENGTH,
  LINK_PREVIEW_SITE_NAME_MAX_LENGTH,
  LINK_PREVIEW_TITLE_MAX_LENGTH
} from '@chatovo/schemas';
import ogs from 'open-graph-scraper';
import { truncate } from 'remeda';

import type { ExtractLinkMetadataInput, LinkMetadata } from './extract-link-metadata.types';

const cleanText = (value: string | undefined, maxLength: number): string | null => {
  const collapsed = value?.replace(/\s+/g, ' ').trim();

  return collapsed ? truncate(collapsed, maxLength) : null;
};

const resolveHttpUrl = (value: string | undefined, base: string): string | null => {
  if (!value) {
    return null;
  }

  const resolved = URL.parse(value, base);

  return resolved?.protocol === 'http:' || resolved?.protocol === 'https:' ? resolved.href : null;
};

export const extractLinkMetadata = async ({
  html,
  url
}: ExtractLinkMetadataInput): Promise<LinkMetadata | null> => {
  const { result } = await ogs({ html });
  const title = cleanText(result.ogTitle ?? result.twitterTitle, LINK_PREVIEW_TITLE_MAX_LENGTH);

  if (!title) {
    return null;
  }

  const hostname = new URL(url).hostname.replace(/^www\./, '');

  return {
    title,
    description: cleanText(
      result.ogDescription ?? result.twitterDescription,
      LINK_PREVIEW_DESCRIPTION_MAX_LENGTH
    ),
    siteName: cleanText(result.ogSiteName, LINK_PREVIEW_SITE_NAME_MAX_LENGTH) ?? hostname,
    imageUrl: resolveHttpUrl(result.ogImage?.[0]?.url ?? result.twitterImage?.[0]?.url, url)
  };
};
