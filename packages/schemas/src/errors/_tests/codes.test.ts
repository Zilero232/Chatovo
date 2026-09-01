import { describe, expect, it } from 'vitest';

import { apiErrorCodeSchema, apiErrorSchema } from '../codes';

describe('apiErrorSchema', () => {
  it('accepts a well-formed error body', () => {
    expect(apiErrorSchema.parse({ error: 'User not found', code: 'USER_NOT_FOUND' })).toEqual({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  });

  it('falls back to INTERNAL_ERROR for an unknown code', () => {
    expect(apiErrorSchema.parse({ error: 'boom', code: 'NOT_A_REAL_CODE' }).code).toBe(
      'INTERNAL_ERROR'
    );
  });

  it('falls back to INTERNAL_ERROR when the code is missing', () => {
    expect(apiErrorSchema.parse({ error: 'boom' }).code).toBe('INTERNAL_ERROR');
  });

  it('rejects a body without an error message', () => {
    expect(apiErrorSchema.safeParse({ code: 'USER_NOT_FOUND' }).success).toBe(false);
  });
});

describe('apiErrorCodeSchema', () => {
  it('covers the better-auth codes the client maps', () => {
    const authCodes = [
      'USER_NOT_FOUND',
      'INVALID_EMAIL_OR_PASSWORD',
      'INVALID_EMAIL',
      'INVALID_PASSWORD',
      'INVALID_TOKEN',
      'TOKEN_EXPIRED',
      'EMAIL_NOT_VERIFIED',
      'EMAIL_ALREADY_VERIFIED',
      'USER_ALREADY_EXISTS',
      'USER_EMAIL_NOT_FOUND',
      'PASSWORD_TOO_SHORT',
      'PASSWORD_TOO_LONG',
      'SESSION_EXPIRED',
      'CREDENTIAL_ACCOUNT_NOT_FOUND',
      'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
      'USER_ALREADY_HAS_PASSWORD',
      'PASSWORD_ALREADY_SET',
      'ACCOUNT_NOT_FOUND',
      'INVALID_USER',
      'EMAIL_CAN_NOT_BE_UPDATED',
      'CHANGE_EMAIL_DISABLED',
      'SESSION_NOT_FRESH',
      'VERIFICATION_EMAIL_NOT_ENABLED',
      'FAILED_TO_CREATE_USER',
      'FAILED_TO_UPDATE_USER',
      'FAILED_TO_CREATE_SESSION'
    ];

    for (const code of authCodes) {
      expect(apiErrorCodeSchema.safeParse(code).success).toBe(true);
    }
  });

  it('has no duplicate codes', () => {
    const codes = apiErrorCodeSchema.options;

    expect(new Set(codes).size).toBe(codes.length);
  });
});
