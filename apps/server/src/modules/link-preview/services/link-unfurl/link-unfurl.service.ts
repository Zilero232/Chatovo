import type { LinkPreview, LinkPreviewImage, LinkPreviewResponse } from '@chatovo/schemas';
import type { Cache } from 'cache-manager';

import { linkPreviewSchema } from '@chatovo/schemas';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { buildHashKey, fetchImage, resizeImage, safeFetch } from '../../../../lib';
import { saveUpload, toArrayBuffer } from '../../../uploads';
import { LINK_PREVIEW } from '../../config';
import { decodeHtml, extractLinkMetadata } from '../../lib';

@Injectable()
export class LinkUnfurlService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  private async saveImage(imageUrl: string): Promise<LinkPreviewImage | null> {
    const original = await fetchImage({
      url: imageUrl,
      maxBytes: LINK_PREVIEW.unfurl.imageMaxBytes
    });
    const { folder, maxWidth, quality } = LINK_PREVIEW.unfurl.image;
    const resized = original && (await resizeImage({ buffer: original, width: maxWidth, quality }));

    if (!resized) {
      return null;
    }

    const { buffer, width, height } = resized;
    const key = `${folder}/${buildHashKey([buffer])}.webp`;
    const url = await saveUpload(key, toArrayBuffer(buffer));

    return { url, width, height };
  }

  private async buildPreview(url: string): Promise<LinkPreview | null> {
    const page = await safeFetch({
      url,
      accept: LINK_PREVIEW.unfurl.accept,
      maxBytes: LINK_PREVIEW.unfurl.htmlMaxBytes,
      truncate: true
    });

    const html = page && decodeHtml({ body: page.body, contentType: page.contentType });

    if (!page || !html) {
      return null;
    }

    const metadata = await extractLinkMetadata({ html, url: page.url });

    if (!metadata) {
      return null;
    }

    const { imageUrl, ...text } = metadata;
    const image = imageUrl ? await this.saveImage(imageUrl).catch(() => null) : null;
    const preview = linkPreviewSchema.safeParse({ url, ...text, image });

    return preview.success ? preview.data : null;
  }

  private async buildPreviewSafely(url: string): Promise<LinkPreview | null> {
    try {
      return await this.buildPreview(url);
    } catch {
      return null;
    }
  }

  async unfurl(url: string): Promise<LinkPreviewResponse> {
    const { cacheTtlMs, failureCacheTtlMs } = LINK_PREVIEW.unfurl;

    const preview = await this.cache.wrap(
      buildHashKey(['link-preview', url]),
      () => this.buildPreviewSafely(url),
      (value) => (value ? cacheTtlMs : failureCacheTtlMs)
    );

    return { preview };
  }
}
