import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { marketingStaticParams, resolveMarketingPage } from '../resolve-marketing-page';

describe('resolveMarketingPage', () => {
  it('resolves the bare slug to the Russian home page', () => {
    expect(resolveMarketingPage([])).toMatchObject({
      locale: 'ru',
      namespace: 'home',
      path: ROUTES.home
    });
  });

  it('resolves the en slug to the English home page', () => {
    expect(resolveMarketingPage(['en'])).toMatchObject({
      locale: 'en',
      namespace: 'home',
      path: ROUTES.home
    });
  });

  it('resolves a bare section slug to its Russian page', () => {
    expect(resolveMarketingPage(['features'])).toMatchObject({
      locale: 'ru',
      namespace: 'features',
      path: ROUTES.features
    });
  });

  it('resolves an en-prefixed section slug to its English page', () => {
    expect(resolveMarketingPage(['en', 'features'])).toMatchObject({
      locale: 'en',
      namespace: 'features',
      path: ROUTES.features
    });
  });

  it('returns a view for every known page', () => {
    expect(resolveMarketingPage(['changelog'])?.view).toBeTypeOf('function');
    expect(resolveMarketingPage(['en', 'support'])?.view).toBeTypeOf('function');
  });

  it('resolves nothing for unknown slugs', () => {
    expect(resolveMarketingPage(['nope'])).toBeNull();
    expect(resolveMarketingPage(['en', 'nope'])).toBeNull();
    expect(resolveMarketingPage(['features', 'extra'])).toBeNull();
    expect(resolveMarketingPage(['en', 'features', 'extra'])).toBeNull();
    expect(resolveMarketingPage(['privacy'])).toBeNull();
    expect(resolveMarketingPage(['terms'])).toBeNull();
  });
});

describe('marketingStaticParams', () => {
  it('covers exactly the twelve marketing urls', () => {
    const paths = marketingStaticParams().map(({ slug }) => `/${slug.join('/')}`);

    expect(paths.sort()).toEqual(
      [
        '/',
        '/en',
        '/features',
        '/en/features',
        '/download',
        '/en/download',
        '/about',
        '/en/about',
        '/support',
        '/en/support',
        '/changelog',
        '/en/changelog'
      ].sort()
    );
  });

  it('resolves every emitted param back to a page', () => {
    for (const { slug } of marketingStaticParams()) {
      expect(resolveMarketingPage(slug)).not.toBeNull();
    }
  });
});
