import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        const objRes = res as any;
        message = objRes.message || message;
        errorCode = objRes.code || errorCode;
      }
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Database error';
      errorCode = 'DB_QUERY_FAILED';
    }

    const errorResponse = {
      success: false,
      code: errorCode,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    Logger.error(
      `[${request.method}] ${request.url}`,
      exception.stack,
      'AllExceptionsFilter',
    );

    response.status(statusCode).json(errorResponse);
  }
}