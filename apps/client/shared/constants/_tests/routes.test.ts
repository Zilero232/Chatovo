import { describe, expect, it } from 'vitest';

import { isPublicRoute, ROUTES } from '../routes';

describe('isPublicRoute', () => {
  it('treats the auth pages as public', () => {
    expect(isPublicRoute(ROUTES.auth)).toBe(true);
    expect(isPublicRoute(ROUTES.resetPassword)).toBe(true);
  });

  it('treats the landing pages as public', () => {
    expect(isPublicRoute(ROUTES.landing)).toBe(true);
    expect(isPublicRoute(ROUTES.landingEn)).toBe(true);
  });

  it('treats the legal pages as public', () => {
    expect(isPublicRoute(ROUTES.privacy)).toBe(true);
    expect(isPublicRoute(ROUTES.terms)).toBe(true);
  });

  it('keeps the app routes behind auth', () => {
    expect(isPublicRoute(ROUTES.lobby)).toBe(false);
    expect(isPublicRoute(ROUTES.room)).toBe(false);
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
