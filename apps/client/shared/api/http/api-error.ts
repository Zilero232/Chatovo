import { apiErrorSchema } from '@chatovo/schemas';

import type { ApiErrorCode } from '@chatovo/schemas';

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export const toApiError = (data: unknown) => {
  const parsed = apiErrorSchema.safeParse(data);

  if (!parsed.success) {
    return null;
  }

  return new ApiError(parsed.data.code, parsed.data.error);
};

export const apiErrorCode = (error: unknown): ApiErrorCode =>
  error instanceof ApiError ? error.code : 'INTERNAL_ERROR';
