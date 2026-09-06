import { afterEach, describe, expect, it, vi } from 'vitest';

const setAppUrl = (value: string) => {
  vi.doMock('@/shared/config', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/shared/config')>()),
    env: { NEXT_PUBLIC_APP_URL: value }
  }));

  return import('../build-app-href');
};

afterEach(() => {
  vi.resetModules();
  vi.doUnmock('@/shared/config');
});

describe('buildAppHref', () => {
  it('keeps links same-origin when no app host is configured', async () => {
    const { buildAppHref } = await setAppUrl('');

    expect(buildAppHref('/lobby')).toBe('/lobby');
    expect(buildAppHref('/auth')).toBe('/auth');
  });

  it('collapses the lobby to the bare app origin, which serves it as the front page', async () => {
    const { buildAppHref } = await setAppUrl('https://app.chatovo.ru');

    expect(buildAppHref('/lobby')).toBe('https://app.chatovo.ru');
  });

  it('keeps every other path under the app host', async () => {
    const { buildAppHref } = await setAppUrl('https://app.chatovo.ru');

    expect(buildAppHref('/auth')).toBe('https://app.chatovo.ru/auth');
    expect(buildAppHref('/room?id=abc')).toBe('https://app.chatovo.ru/room?id=abc');
  });
});
