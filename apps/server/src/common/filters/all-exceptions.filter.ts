import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

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

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({ error: extractMessage(exception) });

      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : String(exception));

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
}
