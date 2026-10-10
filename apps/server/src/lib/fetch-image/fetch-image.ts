import type { FetchImageInput } from './fetch-image.types';

import { safeFetch } from '../safe-fetch';

/** Downloads a user-supplied image URL through `safeFetch`. Null unless the response really is an image. */
export const fetchImage = async ({ url, maxBytes }: FetchImageInput): Promise<Buffer | null> => {
  const response = await safeFetch({ url, accept: 'image/*', maxBytes });

  return response?.contentType.startsWith('image/') ? response.body : null;
};
