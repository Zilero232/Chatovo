const SECOND_MS = 1_000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;

export const formatSessionDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / SECOND_MS);

  if (ms < MINUTE_MS) {
    return `${totalSeconds}s`;
  }

  if (ms < HOUR_MS) {
    return `${Math.floor(ms / MINUTE_MS)}m ${totalSeconds % 60}s`;
  }

  return `${Math.floor(ms / HOUR_MS)}h ${Math.floor((ms % HOUR_MS) / MINUTE_MS)}m`;
};
