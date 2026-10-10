import { coalesceAsync } from '@cacheable/utils';
import { Injectable, Logger } from '@nestjs/common';
import { readFile, stat } from 'node:fs/promises';
import { match } from 'ts-pattern';

import type { ImageSource } from '../images.types';
import type { OptimizedImage, OptimizeImageInput, RenderImageInput } from './images.service.types';

import { AppBadRequestException, AppNotFoundException } from '../../../common/exceptions';
import { AppConfigService } from '../../../config/config.module';
import { buildHashKey, fetchImage, resizeImage } from '../../../lib';
import { UPLOADS_DIR } from '../../uploads';
import { IMAGES } from '../config';
import { readCachedImage, writeCachedImage } from '../image-cache';
import { resolveImageSource } from '../lib';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(private readonly config: AppConfigService) {}

  private async identifySource(source: ImageSource): Promise<Array<number | string>> {
    return match(source)
      .with({ kind: 'upload' }, async ({ path }) => {
        const modifiedMs = await stat(path).then(
          ({ mtimeMs }) => mtimeMs,
          () => null
        );

        if (modifiedMs === null) {
          throw new AppNotFoundException('IMAGE_NOT_FOUND', 'Image not found');
        }

        return [path, modifiedMs];
      })
      .with({ kind: 'remote' }, async ({ url }) => [url])
      .exhaustive();
  }

  private async loadSource(source: ImageSource): Promise<Buffer | null> {
    return match(source)
      .with({ kind: 'upload' }, ({ path }) => readFile(path).catch(() => null))
      .with({ kind: 'remote' }, ({ url }) => fetchImage({ url, maxBytes: IMAGES.remoteMaxBytes }))
      .exhaustive();
  }

  private async render({ key, source, width, quality }: RenderImageInput): Promise<Buffer> {
    const original = await this.loadSource(source);

    if (!original) {
      throw new AppNotFoundException('IMAGE_NOT_FOUND', 'Image not found');
    }

    const resized = await resizeImage({ buffer: original, width, quality });

    if (!resized) {
      throw new AppBadRequestException('FILE_NOT_IMAGE', 'Not an image');
    }

    await writeCachedImage({ key, buffer: resized.buffer }).catch((error: unknown) => {
      this.logger.warn(`Failed to cache image ${key}: ${String(error)}`);
    });

    return resized.buffer;
  }

  async optimize({ url, width, quality }: OptimizeImageInput): Promise<OptimizedImage> {
    const source = resolveImageSource({
      url,
      filesOrigin: this.config.get('PUBLIC_FILES_URL'),
      uploadsDir: UPLOADS_DIR
    });

    if (!source) {
      throw new AppBadRequestException('IMAGE_SOURCE_NOT_ALLOWED', 'Image source not allowed');
    }

    const key = buildHashKey([...(await this.identifySource(source)), width, quality]);
    const cacheControl = IMAGES.cacheControl[source.kind];
    const maxAgeMs = source.kind === 'remote' ? IMAGES.remoteCacheTtlMs : undefined;

    const cached = await readCachedImage({ key, maxAgeMs });

    if (cached) {
      return { buffer: cached, cacheControl };
    }

    const buffer = await coalesceAsync(key, () => this.render({ key, source, width, quality }));

    return { buffer, cacheControl };
  }
}
