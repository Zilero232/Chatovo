import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { join } from 'node:path';

import { listFileStats, removeFiles, selectEvictions } from '../../../../lib';
import { UPLOADS_DIR } from '../../../uploads';
import { LINK_UNFURL } from '../../config';

@Injectable()
export class LinkPreviewSweeperService {
  private readonly logger = new Logger(LinkPreviewSweeperService.name);

  @Cron(LINK_UNFURL.image.sweepCron)
  async sweep(): Promise<number> {
    const { folder, maxAgeMs } = LINK_UNFURL.image;
    const files = await listFileStats(join(UPLOADS_DIR, folder));

    const removed = await removeFiles(
      selectEvictions({ files, now: Date.now(), maxIdleMs: maxAgeMs, clock: 'modified' })
    );

    if (removed > 0) {
      this.logger.log(`Removed ${removed} of ${files.length} link preview images`);
    }

    return removed;
  }
}
