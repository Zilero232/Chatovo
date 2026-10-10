import { createKeyv } from 'cacheable';

import { LINK_PREVIEW } from '../../config';

export const createUnfurlStore = () => createKeyv({ lruSize: LINK_PREVIEW.unfurl.cacheMaxEntries });
