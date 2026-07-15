import { api } from '../http';

import type { AppDownloads } from '@chatovo/schemas';

export const getAppDownloads = async (): Promise<AppDownloads> => {
  const { data } = await api.get('/github/releases/downloads');

  return data;
};
