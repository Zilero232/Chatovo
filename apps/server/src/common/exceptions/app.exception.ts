import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import type { ApiErrorCode } from '@chatovo/schemas';

type CodedResponse = {
  error: string;
  code: ApiErrorCode;
};

const body = (code: ApiErrorCode, error: string): CodedResponse => ({ error, code });

export const isCodedResponse = (response: unknown): response is CodedResponse =>
  typeof response === 'object' &&
  response !== null &&
  'code' in response &&
  typeof (response as CodedResponse).code === 'string';

export class AppNotFoundException extends NotFoundException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppConflictException extends ConflictException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppForbiddenException extends ForbiddenException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppBadRequestException extends BadRequestException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppUnauthorizedException extends UnauthorizedException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}
