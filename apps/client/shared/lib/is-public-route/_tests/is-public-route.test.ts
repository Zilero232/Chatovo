import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { isOpenRoute, isPublicRoute } from '../is-public-route';

describe('isPublicRoute', () => {
  it('treats the auth pages as public', () => {
    expect(isPublicRoute(ROUTES.auth)).toBe(true);
    expect(isPublicRoute(ROUTES.resetPassword)).toBe(true);
  });

  it('treats the home pages as public', () => {
    expect(isPublicRoute(ROUTES.home)).toBe(true);
    expect(isPublicRoute(ROUTES.homeEn)).toBe(true);
  });

  it('treats the legal pages as public', () => {
    expect(isPublicRoute(ROUTES.privacy)).toBe(true);
    expect(isPublicRoute(ROUTES.terms)).toBe(true);
  });

  it('treats the marketing pages as public', () => {
    expect(isPublicRoute(ROUTES.features)).toBe(true);
    expect(isPublicRoute(ROUTES.download)).toBe(true);
    expect(isPublicRoute(ROUTES.about)).toBe(true);
    expect(isPublicRoute(ROUTES.support)).toBe(true);
    expect(isPublicRoute(ROUTES.changelog)).toBe(true);
  });

  it('treats the English marketing pages as public', () => {
    expect(isPublicRoute('/en/features')).toBe(true);
    expect(isPublicRoute('/en/download')).toBe(true);
    expect(isPublicRoute('/en/about')).toBe(true);
    expect(isPublicRoute('/en/support')).toBe(true);
    expect(isPublicRoute('/en/changelog')).toBe(true);
  });

  it('keeps the app routes behind auth', () => {
    expect(isPublicRoute(ROUTES.lobby)).toBe(false);
    expect(isPublicRoute(ROUTES.room)).toBe(false);
    expect(isPublicRoute(ROUTES.admin)).toBe(false);
  });

  it('matches nested paths under a public route', () => {
    expect(isPublicRoute(`${ROUTES.auth}/anything`)).toBe(true);
  });

  it('does not match a route that merely shares a prefix', () => {
    expect(isPublicRoute('/authenticated')).toBe(false);
  });

  it('rejects an unknown path', () => {
    expect(isPublicRoute('/definitely-not-a-route')).toBe(false);
  });
});

describe('isOpenRoute', () => {
  it('opens the account deletion page for everyone', () => {
    expect(isOpenRoute(ROUTES.accountDelete)).toBe(true);
  });

  it('keeps it out of the guest zone, so a signed-in user is not bounced to the lobby', () => {
    expect(isPublicRoute(ROUTES.accountDelete)).toBe(false);
  });

  it('does not open the guest pages, which do redirect a signed-in user', () => {
    expect(isOpenRoute(ROUTES.auth)).toBe(false);
    expect(isOpenRoute(ROUTES.privacy)).toBe(false);
  });

  it('does not open an app route', () => {
    expect(isOpenRoute(ROUTES.lobby)).toBe(false);
  });

  it('matches a nested path under an open route', () => {
    expect(isOpenRoute(`${ROUTES.accountDelete}/done`)).toBe(true);
  });

  it('does not match a route that merely shares a prefix', () => {
    expect(isOpenRoute('/account/delete-everything-else')).toBe(false);
  });
});
