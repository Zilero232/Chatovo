import { createCache } from 'cache-manager';
import { describe, expect, it, vi } from 'vitest';

import { createUnfurlStore } from '../create-unfurl-store';

const wrapTwice = async (factory: () => Promise<unknown>) => {
  const cache = createCache({ stores: [createUnfurlStore()] });

  await cache.wrap('key', factory, 60_000);
  await cache.wrap('key', factory, 60_000);
};

describe('createUnfurlStore', () => {
  it('serves a cached preview instead of unfurling the page again', async () => {
    const factory = vi.fn(async () => ({ title: 'Hades' }));

    await wrapTwice(factory);

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('remembers a failed unfurl too, so a dead link is not fetched on every render', async () => {
    const factory = vi.fn(async () => null);

    await wrapTwice(factory);

    expect(factory).toHaveBeenCalledTimes(1);
  });
});
