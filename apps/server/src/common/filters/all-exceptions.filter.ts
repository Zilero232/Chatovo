import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { isCodedResponse } from '../exceptions';

import type { ApiErrorCode } from '@chatovo/schemas';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

type ErrorBody = {
  error: string;
  code: ApiErrorCode;
};

const STATUS_CODE: Partial<Record<HttpStatus, ApiErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: 'VALIDATION_FAILED',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
};

const extractMessage = (exception: HttpException): string => {
  const response = exception.getResponse();

  if (typeof response === 'string') {
    return response;
  }

  const { message } = response as { message?: string | string[] };

  if (Array.isArray(message)) {
    return message[0] ?? exception.message;
  }

  return message ?? exception.message;
};

const toBody = (exception: HttpException): ErrorBody => {
  const response = exception.getResponse();

  if (isCodedResponse(response)) {
    return response;
  }

  return {
    error: extractMessage(exception),
    code: STATUS_CODE[exception.getStatus() as HttpStatus] ?? 'INTERNAL_ERROR',
  };
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(toBody(exception));

      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : String(exception));

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
}
