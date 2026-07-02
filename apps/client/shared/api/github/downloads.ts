import { api, readErrorMessage } from '../http';
import type { AppDownloads } from '@chatovo/schemas';

export const getAppDownloads = async (): Promise<AppDownloads> => {
  const res = await api.github.releases.downloads.$get();

  if (!res.ok) {
    const message = await readErrorMessage(res);

    throw new Error(message ?? `Failed to fetch app downloads: ${res.status}`);
  }

  return await res.json();
};
