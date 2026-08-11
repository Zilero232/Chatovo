import type { RunNotificationInput } from './run-notification.types';

export const runNotification = async ({ logger, channel, label, task }: RunNotificationInput) => {
  try {
    await task;
  } catch (error) {
    logger.warn(`${channel} notification "${label}" failed: ${String(error)}`);
  }
};
