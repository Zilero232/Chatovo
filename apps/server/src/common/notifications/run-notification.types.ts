import type { Logger } from '@nestjs/common';

export type RunNotificationInput = {
  logger: Logger;
  channel: string;
  label: string;
  task: Promise<unknown>;
};
