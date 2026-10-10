import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { partition } from 'remeda';

import { removeFiles, selectEvictions } from '../../../lib';
import { IMAGES } from '../config';
import { listCachedImages } from '../image-cache';

@Injectable()
export class ImageCacheSweeperService {
  private readonly logger = new Logger(ImageCacheSweeperService.name);

  @Cron(IMAGES.cache.sweepCron)
  async sweep(): Promise<number> {
    const { maxIdleMs, maxBytes, temporarySuffix, temporaryMaxAgeMs } = IMAGES.cache;
    const files = await listCachedImages();
    const now = Date.now();
    const [temporary, cached] = partition(files, ({ path }) => path.endsWith(temporarySuffix));

    const removed = await removeFiles([
      ...selectEvictions({
        files: temporary,
        now,
        maxIdleMs: temporaryMaxAgeMs,
        clock: 'modified'
      }),
      ...selectEvictions({ files: cached, now, maxIdleMs, maxBytes })
    ]);

    if (removed > 0) {
      this.logger.log(`Removed ${removed} of ${files.length} cached images`);
    }

    return removed;
  }
}
